import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'

import { ConfigService, Cookies } from '@spomen/core'
import { Request, Response } from 'express'
import moment from 'moment'
import { v4 } from 'uuid'

import { IAuthorizationCodePayload, IOAuthTokenPayload } from '../token/Tokens'
import { TokenService } from '../token/token.service'

import { AuthService } from '../auth/auth.service'

import { OAuthAuthorizeQueryType } from '../../app/dtos/OAuthAuthorizeQuery.dto'
import { OAuthCredentialsType } from '../../app/dtos/OAuthCredentials.dto'
import { OAuthLoginQueryType } from '../../app/dtos/OAuthLoginQuery.dto'
import { OAuthTokenQueryType } from '../../app/dtos/OAuthTokenQuery.dto'
import { IUser, OAUTH_ENDPOINTS } from './OAuth'
import { ENV } from '../Config'

import { STATUS, TOKEN_TYPES } from '../Enums'

import { OAuthParamsStr } from '../utils/params'

import { InjectionToken } from '../../app/injection-token'
import { JsonWebTokenError } from '@nestjs/jwt'

@Injectable()
export class OAuthService {
  private readonly host: string
  private readonly domain: string

  constructor(
    @Inject(InjectionToken.TOKEN_SERVICE) private readonly token: TokenService,
    @Inject(InjectionToken.AUTH_SERVICE) private readonly auth: AuthService,
    private readonly config: ConfigService
  ) {
    this.domain = String(config.env<ENV>('HOST'))
    this.host = `${config.isProduction ? 'https' : 'http'}://${config.env<ENV>('DOMAIN')}`
  }

  /**
   * Редирект на эндпойнт входа по учётным данным
   * @param {Request} req Запрос
   * @param {Response} res Ответ
   * @param {OAuthLoginQueryType} query Параметры OAuth
   */
  async login(req: Request, res: Response, query: OAuthLoginQueryType) {
    const params = OAuthParamsStr(query)

    if (req.cookies && req.cookies['oauth']) {
      return res.redirect(`${this.host}${OAUTH_ENDPOINTS.AUTHORIZE}?${params}`)
    }

    return res.render('login', {
      action: `${this.host}/${OAUTH_ENDPOINTS.LOGIN}?${params}`,
    })
  }

  /**
   * Обработка входа по учётным данным
   * @param {Request} req Запрос
   * @param {OAuthCredentialsType} credentials Учётные данные
   * @param {Response} response Ответ
   */
  async post_login(
    req: Request,
    credentials: OAuthCredentialsType,
    response: Response
  ) {
    const query = req.query as OAuthLoginQueryType

    const params = OAuthParamsStr(query)

    const { status, account } = await this.auth.validateUser(credentials)

    if (status === STATUS.FAILED) {
      return {
        url: `${this.host}/${OAUTH_ENDPOINTS.LOGIN}?${params}`,
        statusCode: 303,
      }
    }

    const verifySessionLimit = await this.auth.validateSessionLimit(
      query.client_id,
      account.getId()
    )

    if (!verifySessionLimit) {
      throw new HttpException(
        'Превышено количество сессий',
        HttpStatus.TOO_MANY_REQUESTS
      )
    }

    return this.setOAuthCookie(
      req,
      {
        id: account.getId(),
        email: account.getEmail(),
        username: account.getUsername(),
      },
      response
    )
  }

  /**
   * Обработка выдачи authorization code
   * @param {OAuthAuthorizeQueryType} query Параметры OAuth
   * @param {Request} req Запрос
   */
  async authenticateUser(query: OAuthAuthorizeQueryType, req: Request) {
    const { user } = await this.token.decodeToken<IOAuthTokenPayload>(
      <string>req.cookies['oauth']
    )

    const authorizationCode = await this.token.generateToken(
      {
        client: {
          id: query.client_id,
          grants: [],
        },
        user,
        scope: query.scope,
        redirect_url: query.redirect_uri,
      },
      TOKEN_TYPES.AUTHORIZATION_CODE
    )

    const url = `${query.redirect_uri}?code=${authorizationCode}&state=${query.state}`

    return { url, statusCode: 303 }
  }

  /**
   * Обработка выдачи токенов
   * @param {OAuthTokenQueryType} query Параметры OAuth
   */
  async grantToken(query: OAuthTokenQueryType) {
    // TODO: Добавить удаление authorization code

    const verifiedCode =
      await this.token.verifyToken<IAuthorizationCodePayload>(
        query.code,
        TOKEN_TYPES.AUTHORIZATION_CODE
      )

    if (verifiedCode instanceof JsonWebTokenError) {
      throw new UnauthorizedException()
    }

    const verifySessionLimit = await this.auth.validateSessionLimit(
      query.client_id,
      verifiedCode.user.id
    )

    if (!verifySessionLimit) {
      throw new HttpException(
        'Превышено количество сессий',
        HttpStatus.TOO_MANY_REQUESTS
      )
    }

    const access_token = await this.token.generateToken(
      {
        client: {
          id: query.client_id,
          grants: [],
        },
        redirect_url: query.redirect_uri,
        user: verifiedCode.user,
      },
      TOKEN_TYPES.ACCESS
    )

    const refresh_token_id = v4()

    const refresh_token = await this.token.generateToken(
      {
        client: {
          id: query.client_id,
          grants: [],
        },
        user: verifiedCode.user,
        scope: [],
        token_id: refresh_token_id,
      },
      TOKEN_TYPES.REFRESH
    )

    await this.auth.createSession(
      refresh_token_id,
      refresh_token,
      query.client_id,
      verifiedCode.user.id,
      moment()
        .add(Number(this.config.env<ENV>('REFRESH_TOKEN_EXPIRATION')), 's')
        .toDate()
    )

    const user = await this.auth.getAuthenticatedUser(verifiedCode.user.id)

    Logger.log(
      `Записана сессия для аккаунта '${user.getEmail()}' через клиент '${query.client_id}'`
    )

    return {
      access_token,
      refresh_token,
      user,
      token_type: 'Bearer',
    }
  }

  async setOAuthCookie(req: Request, user: IUser, res: Response) {
    const params = OAuthParamsStr(req.query as OAuthAuthorizeQueryType)

    const token = await this.token.generateToken(
      {
        user,
      },
      TOKEN_TYPES.OAUTH
    )

    // TODO: Описать логику сохранения токена в приложении

    const cookie = new Cookies({
      key: 'oauth',
      domain: this.domain,
      path: '/oauth',
      value: token,
      maxAge: Number(this.config.env<ENV>('OAUTH_TOKEN_EXPIRATION')),
      secure: this.config.isProduction,
    })

    res.setHeader('Set-Cookie', [cookie.toString()])

    return {
      url: `${this.host}${OAUTH_ENDPOINTS.AUTHORIZE}?${params}`,
      statusCode: 303,
    }
  }
}

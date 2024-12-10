import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'

import { ConfigService, Cookies } from '@spomen/core'
import { JsonWebTokenError } from '@nestjs/jwt'
import { Request, Response } from 'express'
import moment from 'moment'
import { v4 } from 'uuid'

import {
  IAuthorizationCodePayload,
  IOAuthTokenPayload,
  IRefreshTokenPayload,
} from '../token/Tokens'
import { TokenService } from '../token/token.service'

import { AuthService } from '../auth/auth.service'

import { OAuthAuthorizeQueryType } from '../../app/dtos/OAuthAuthorizeQuery.dto'
import { OAuthRefreshQueryType } from '../../app/dtos/OAuthRefreshQuery.dto'
import { OAuthCredentialsType } from '../../app/dtos/OAuthCredentials.dto'
import { OAuthLoginQueryType } from '../../app/dtos/OAuthLoginQuery.dto'
import { OAuthTokenQueryType } from '../../app/dtos/OAuthTokenQuery.dto'
import { IUser, OAUTH_ENDPOINTS } from './OAuth'
import { ENV } from '../Config'

import { STATUS, TOKEN_TYPES } from '../Enums'

import { OAuthParamsStr } from '../utils/params'

import { InjectionToken } from '../../app/injection-token'

type Tokens = {
  access_token: string
  refresh_token: string
  refresh_token_id: string
}

@Injectable()
export class OAuthService {
  private readonly host: string
  private readonly domain: string
  private readonly refresh_expiration: number

  constructor(
    @Inject(InjectionToken.TOKEN_SERVICE) private readonly token: TokenService,
    @Inject(InjectionToken.AUTH_SERVICE) private readonly auth: AuthService,
    private readonly config: ConfigService
  ) {
    this.domain = String(config.env<ENV>('HOST'))
    this.host = `${config.isProduction ? 'https' : 'http'}://${config.env<ENV>('DOMAIN')}`
    this.refresh_expiration = Number(
      config.env<ENV>('REFRESH_TOKEN_EXPIRATION')
    )
  }

  async login(req: Request, res: Response, query: OAuthLoginQueryType) {
    const params = OAuthParamsStr(query)

    if (req.cookies && req.cookies['oauth']) {
      return res.redirect(`${this.host}${OAUTH_ENDPOINTS.AUTHORIZE}?${params}`)
    }

    return res.render('login', {
      action: `${this.host}/${OAUTH_ENDPOINTS.LOGIN}?${params}`,
    })
  }

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

    const tokens: Tokens = await this.generateTokens(
      query.client_id,
      query.redirect_uri,
      verifiedCode.user
    )

    await this.auth.createSession(
      tokens.refresh_token_id,
      tokens.refresh_token,
      query.client_id,
      verifiedCode.user.id,
      moment().add(this.refresh_expiration, 's').toDate()
    )

    const authenticatedUser = await this.auth.getAuthenticatedUser(
      verifiedCode.user.id
    )

    Logger.log(
      `Создана сессия '${tokens.refresh_token_id}' для аккаунта '${authenticatedUser.getEmail()}'`
    )

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: authenticatedUser,
      token_type: 'Bearer',
    }
  }

  async refresh(query: OAuthRefreshQueryType) {
    const session = await this.auth.findSession(query.refresh_token)

    const verifiedToken = await this.token.verifyToken<IRefreshTokenPayload>(
      query.refresh_token,
      TOKEN_TYPES.REFRESH
    )

    if (!session) {
      throw new UnauthorizedException()
    }

    if (!session.getExpiredAt()) {
      if (verifiedToken instanceof JsonWebTokenError) {
        await this.auth.removeSession(session.getId())
        Logger.log(
          `Удалена сессия ${session.getId()} для аккаунта '${session.getAccountId()}'`
        )
        throw new UnauthorizedException()
      }
    }

    if (moment().isAfter(session.getExpiredAt())) {
      await this.auth.removeSession(session.getId())
      Logger.log(
        `Удалена сессия ${session.getId()} для аккаунта '${session.getAccountId()}'`
      )
      throw new UnauthorizedException()
    }

    const tokens = await this.generateTokens(
      query.client_id,
      '',
      verifiedToken.user
    )

    session.update(
      tokens.refresh_token,
      moment().add(this.refresh_expiration, 's').toDate()
    )
    session.commit()

    await this.auth.updateSession(session.getId(), session)

    const user = await this.auth.getAuthenticatedUser(verifiedToken.user.id)

    Logger.log(
      `Обновлена сессия '${session.getId()}' для аккаунта '${user.getEmail()}'`
    )

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: 'Bearer',
      user,
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

  private async generateTokens(
    client_id: string,
    redirect_url: string,
    user: IUser
  ): Promise<Tokens> {
    const access_token = await this.token.generateToken(
      {
        client: {
          id: client_id,
          grants: [],
        },
        redirect_url,
        user,
      },
      TOKEN_TYPES.ACCESS
    )

    const refresh_token_id = v4()

    const refresh_token = await this.token.generateToken(
      {
        client: {
          id: client_id,
          grants: [],
        },
        user,
        scope: [],
        token_id: refresh_token_id,
      },
      TOKEN_TYPES.REFRESH
    )

    return {
      access_token,
      refresh_token,
      refresh_token_id,
    }
  }
}

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common'

import { ZodSerializerDto } from 'nestjs-zod'
import { Request, Response } from 'express'
import { CommandBus } from '@nestjs/cqrs'

import { ValidateClient } from '../infrastructure/guard/validate-client.decorator'
import { CONFIRM_EMAIL_STATUS, SIGN_UP_STATUS } from '../infrastructure/Enums'
import { OAuthService } from '../infrastructure/oauth/OAuth.service'

import { IAccount } from '../domain/Account'

import { ConfirmEmailCommand } from '../app/commands/ConfirmEmailCommand'
import { SignUpCommand } from '../app/commands/SignUpCommand'

import { OAuthAuthorizeQueryDto } from '../app/dtos/OAuthAuthorizeQuery.dto'
import { OAuthTokenResponseDto } from '../app/dtos/OAuthTokenRespone.dto'
import { OAuthCredentialsDto } from '../app/dtos/OAuthCredentials.dto'
import { OAuthTokenQueryDto } from '../app/dtos/OAuthTokenQuery.dto'
import { OAuthLoginQueryDto } from '../app/dtos/OAuthLoginQuery.dto'
import { SignUpDto, SignUpResult } from '../app/dtos/SignUp.dto'
import { SignUpQueryDto } from '../app/dtos/SignUpQuery.dto'
import { AccountDto } from '../app/dtos/Account.dto'

import { InjectionToken } from '../app/injection-token'
import { OAuthRefreshQueryDto } from '../app/dtos/OAuthRefreshQuery.dto'

@Controller('oauth')
export class OAuthController {
  constructor(
    @Inject(InjectionToken.OAUTH_SERVICE) private readonly oauth: OAuthService,
    readonly commandBus: CommandBus
  ) {}

  @Post('sign-up')
  @ValidateClient()
  @ZodSerializerDto(AccountDto)
  async signUp(
    @Body() dto: SignUpDto,
    @Query() query: SignUpQueryDto
  ): Promise<IAccount> {
    const result = await this.commandBus.execute<SignUpCommand, SignUpResult>(
      new SignUpCommand({
        username: dto.username,
        email: dto.email,
        password: dto.password,
        client_id: query.client_id,
      })
    )

    if (result.status !== SIGN_UP_STATUS.SUCCESS || !result.account) {
      throw new ForbiddenException()
    }

    return result.account
  }

  @Get('confirm/:token')
  @Redirect('https://spomen.space', 302)
  async confirmEmail(@Param('token') token: string) {
    if (!token || token.length < 5) {
      throw new UnauthorizedException()
    }

    const confirmStatus: CONFIRM_EMAIL_STATUS = await this.commandBus.execute(
      new ConfirmEmailCommand({ token })
    )

    switch (confirmStatus) {
      case CONFIRM_EMAIL_STATUS.INVALID:
        throw new UnauthorizedException()
      case CONFIRM_EMAIL_STATUS.EXPIRED:
        // TODO: Добавить редирект на клиент с параметров устаревшей ссылки на подтверждение почты
        return { url: 'https://www.bing.com' }
      case CONFIRM_EMAIL_STATUS.ALREADY_CONFIRMED:
        // TODO: Добавить редирект на клиент
        return { url: 'https://google.com' }
      case CONFIRM_EMAIL_STATUS.SUCCESS:
        // TODO: Добавить редирект на клиент с параметром успешного подтверждения почты
        return { url: 'https://yandex.ru' }
    }
  }

  /**
   * Страница входа по учётным данным
   * @param {Request} req Запрос
   * @param {Response} res Ответ
   * @param {OAuthLoginQueryType} query Параметры OAuth
   */
  @Get('login')
  @ValidateClient()
  getLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: OAuthLoginQueryDto
  ) {
    return this.oauth.login(req, res, query)
  }

  /**
   * Обработка входа по учётным данным
   * @param {Request} req Запрос
   * @param {OAuthCredentialsType} credentials Учётные данные
   * @param {OAuthLoginQueryType} query Параметры OAuth
   * @param {Response} res Ответ
   */
  @Post('login')
  @ValidateClient()
  @Redirect('error', 404)
  login(
    @Req() req: Request,
    @Body() credentials: OAuthCredentialsDto,
    @Query() query: OAuthLoginQueryDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.oauth.post_login(req, credentials, res)
  }

  /**
   * Страница предоставления авторизации
   * @param {Request} req Запрос
   * @param {OAuthAuthorizeQueryDto} query Параметры OAuth
   */
  @Get('authorize')
  @Redirect('login', 303)
  @ValidateClient()
  authorizeGET(@Req() req: Request, @Query() query: OAuthAuthorizeQueryDto) {
    return this.oauth.authenticateUser(query, req)
  }

  /**
   * Страница предоставления авторизации
   * @param {Request} req Запрос
   * @param {OAuthAuthorizeQueryDto} query Параметры OAuth
   */
  @Post('authorize')
  @Redirect('login', 303)
  @ValidateClient()
  authorizePOST(@Req() req: Request, @Query() query: OAuthAuthorizeQueryDto) {
    return this.oauth.authenticateUser(query, req)
  }

  /**
   * Обработка получения пары токенов
   * @param {OAuthTokenQueryType} query Параметры OAuth
   */
  @Get('token')
  @ValidateClient()
  @ZodSerializerDto(OAuthTokenResponseDto)
  tokenGET(@Query() query: OAuthTokenQueryDto) {
    return this.oauth.grantToken(query)
  }

  /**
   * Обработка получения пары токенов
   * @param {OAuthTokenQueryType} query Параметры OAuth
   */
  @Post('token')
  @ValidateClient()
  @ZodSerializerDto(OAuthTokenResponseDto)
  tokenPOST(@Query() query: OAuthTokenQueryDto) {
    return this.oauth.grantToken(query)
  }

  /**
   * Обработка обновления токенов
   * @param query
   */
  @Post('refresh')
  @ValidateClient()
  @ZodSerializerDto(OAuthTokenResponseDto)
  refresh(@Query() query: OAuthRefreshQueryDto) {
    return this.oauth.refresh(query)
  }
}

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  UnauthorizedException,
} from '@nestjs/common'

import { ZodSerializerDto } from 'nestjs-zod'
import { CommandBus } from '@nestjs/cqrs'

import { CONFIRM_EMAIL_STATUS, SIGN_UP_STATUS } from '../infrastructure/Enums'

import { IAccount } from '../domain/Account'

import { ConfirmEmailCommand } from '../app/commands/ConfirmEmailCommand'
import { SignUpCommand } from '../app/commands/SignUpCommand'

import { ClientIdQueryDto } from '../app/dtos/ClientIdQuery.dto'
import { SignUpDto, SignUpResult } from '../app/dtos/SignUp.dto'
import { AccountDto } from '../app/dtos/Account.dto'

@Controller('oauth2')
export class OAuth2Controller {
  constructor(readonly commandBus: CommandBus) {}

  @Post('sign-up')
  @ZodSerializerDto(AccountDto)
  async signUp(
    @Body() dto: SignUpDto,
    @Query() query: ClientIdQueryDto
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

  @Post('authorize')
  authorizeClient() {
    return true
  }

  @Post('token')
  grantToken() {
    return true
  }

  @Post('refresh')
  refreshToken() {
    return true
  }
}

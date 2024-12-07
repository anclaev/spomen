import { AuthorizationCode, Token } from 'oauth2-server'
import { Body, Controller, Post } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { CommandBus } from '@nestjs/cqrs'
import { of } from 'rxjs'

import {
  OAuth2Authenticate,
  OAuth2Authorization,
  OAuth2RenewToken,
  OAuth2Token,
} from '@boyuai/nestjs-oauth2-server'

import { SignUpCommand } from '../app/commands/SignUpCommand'
import { AccountDto } from '../app/dtos/Account.dto'
import { SignUpDto } from '../app/dtos/SignUp.dto'

@Controller('oauth')
export class OAuthController {
  constructor(readonly commandBus: CommandBus) {}

  @Post('sign-up')
  @ZodSerializerDto(AccountDto)
  async signUp(@Body() dto: SignUpDto): Promise<AccountDto> {
    return await this.commandBus.execute(new SignUpCommand(dto))
  }

  @Post('authorize')
  authorizeClient(
    @OAuth2Authorization()
    authorization: AuthorizationCode
  ) {
    return of(authorization)
  }

  @Post('token')
  @OAuth2Authenticate()
  grantToken(@OAuth2Token() token: Token) {
    return of(token)
  }

  @Post('refresh')
  @OAuth2RenewToken()
  refreshToken(@OAuth2Token() token: Token) {
    return of(token)
  }
}

import {
  AccountCredentialsWithPasskey,
  AccountService,
  ConfigService,
  Tokens,
} from '@spomen/core'

import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ClientGrpc } from '@nestjs/microservices'
import { JwtService } from '@nestjs/jwt'
import { Inject } from '@nestjs/common'
import { lastValueFrom } from 'rxjs'
import argon2 from 'argon2'

import { AuthRepository } from '../../infrastructure/AuthRepository'

import { AuthFactory } from '../../domain/AuthFactory'

import { LoginWithPasskeyCommand } from './LoginWithPasskeyCommand'
import { CreateTokenCommand } from './CreateTokenCommand'
import { InjectionToken } from '../injection-token'

@CommandHandler(LoginWithPasskeyCommand)
export class LoginWithPasskeyHandler
  implements ICommandHandler<LoginWithPasskeyCommand, Tokens>
{
  private account: AccountService

  constructor(
    private readonly commandBus: CommandBus,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    @Inject(InjectionToken.ACCOUNT_SERVICE)
    private accountClient: ClientGrpc,
    @Inject(InjectionToken.AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    @Inject()
    private readonly authFactory: AuthFactory
  ) {
    this.account =
      this.accountClient.getService<AccountService>('AccountService')
  }

  async execute({ payload }: LoginWithPasskeyCommand): Promise<Tokens | null> {
    const { login, passkey, email } = payload

    let credentials: AccountCredentialsWithPasskey | null = null

    try {
      if (login) {
        credentials = await lastValueFrom(
          this.account.GetAccountPasskeyByLogin({
            login,
          })
        )
      }

      if (email) {
        credentials = await lastValueFrom(
          this.account.GetAccountPasskeyByEmail({
            email,
          })
        )
      }
    } catch (e) {
      return null
    }

    if (!credentials!.passkey) {
      return null
    }

    const passwordIsVerified = await argon2.verify(
      credentials!.passkey,
      passkey
    )

    if (!passwordIsVerified) return null

    return await this.commandBus.execute<CreateTokenCommand, Tokens>(
      new CreateTokenCommand({
        id: credentials!.id,
        login: credentials!.login,
        email: credentials!.email,
      })
    )
  }
}

import {
  AccountCredentialsWithPassword,
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

import { LoginWithPasswordCommand } from './LoginWithPasswordCommand'
import { InjectionToken } from '../injection-token'
import { CreateTokenCommand } from './CreateTokenCommand'

@CommandHandler(LoginWithPasswordCommand)
export class LoginWithPasswordHandler
  implements ICommandHandler<LoginWithPasswordCommand, Tokens>
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

  async execute({ payload }: LoginWithPasswordCommand): Promise<Tokens | null> {
    const { login, password, email } = payload

    let credentials: AccountCredentialsWithPassword | null = null

    try {
      if (login) {
        credentials = await lastValueFrom(
          this.account.GetAccountPasswordByLogin({
            login,
          })
        )
      }

      if (email) {
        credentials = await lastValueFrom(
          this.account.GetAccountPasswordByEmail({
            email,
          })
        )
      }
    } catch (e) {
      // TODO: Добавить логирование того, что сервис аккаунтов лежит
      return null
    }

    const passwordIsVerified = await argon2.verify(
      credentials!.password,
      password
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

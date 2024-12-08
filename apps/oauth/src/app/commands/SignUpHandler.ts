import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import argon2 from 'argon2'

import { OAuthClientRepository } from '../../infrastructure/repository/OAuthClient.repository'
import { AccountRepository } from '../../infrastructure/repository/account.repository'

import { AccountFactory } from '../../domain/AccountFactory'

import { InjectionToken } from '../injection-token'

import { SignUpResult } from '../dtos/SignUp.dto'
import { SignUpCommand } from './SignUpCommand'
import { OAUTH_CLIENT_SCOPES, SIGN_UP_STATUS } from '../../infrastructure/Enums'

@CommandHandler(SignUpCommand)
export class SignUpHandler
  implements ICommandHandler<SignUpCommand, SignUpResult>
{
  constructor(
    @Inject(InjectionToken.OAUTH_CLIENT_REPOSITORY)
    private readonly client: OAuthClientRepository,
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly account: AccountRepository,
    @Inject()
    private readonly accountFactory: AccountFactory
  ) {}

  async execute({ dto }: SignUpCommand): Promise<SignUpResult> {
    const client = await this.client.findById(dto.client_id!)

    if (!client) {
      return { status: SIGN_UP_STATUS.FORBIDDEN }
    }

    const clientAccessed =
      client.getScopes().includes(OAUTH_CLIENT_SCOPES.ROOT) ||
      client.getScopes().includes(OAUTH_CLIENT_SCOPES.REGISTER_ACCOUNTS)

    if (!clientAccessed) {
      return { status: SIGN_UP_STATUS.FORBIDDEN }
    }

    dto.password = await argon2.hash(dto.password)

    const account = await this.accountFactory.create({
      email: dto.email,
      password: dto.password,
      username: dto.username,
    })

    const registeredAccount = await this.account.create(account)

    registeredAccount.create(dto.client_id)
    registeredAccount.commit()

    return { account: registeredAccount, status: SIGN_UP_STATUS.SUCCESS }
  }
}

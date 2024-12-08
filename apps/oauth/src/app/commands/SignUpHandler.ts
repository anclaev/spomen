import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import argon2 from 'argon2'

import { AccountRepository } from '../../infrastructure/repository/account.repository'

import { AccountFactory } from '../../domain/AccountFactory'
import { IAccount } from '../../domain/Account'

import { InjectionToken } from '../injection-token'

import { SignUpCommand } from './SignUpCommand'

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand, IAccount> {
  constructor(
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly account: AccountRepository,
    @Inject()
    private readonly accountFactory: AccountFactory
  ) {}

  async execute({ dto }: SignUpCommand): Promise<IAccount> {
    // TODO: Добавить проверку клиента

    dto.password = await argon2.hash(dto.password)

    const account = await this.accountFactory.create({
      email: dto.email,
      password: dto.password,
      username: dto.username,
    })

    const registeredAccount = await this.account.create(account)

    registeredAccount.create(dto.client_id)
    registeredAccount.commit()

    return registeredAccount
  }
}

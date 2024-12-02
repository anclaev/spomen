import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import argon2 from 'argon2'

import { AccountRepository } from '../../infrastructure/AccountRepository'
import { AccountFactory } from '../../domain/AccountFactory'
import { IAccount } from '../../domain/Account'

import { CreateAccountCommand } from './CreateAccountCommand'
import { InjectionToken } from '../injection-token'

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand, IAccount>
{
  constructor(
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepository,
    @Inject()
    private readonly accountFactory: AccountFactory
  ) {}

  async execute({ dto }: CreateAccountCommand): Promise<IAccount> {
    dto.password = await argon2.hash(dto.password)

    const account = await this.accountFactory.create({
      login: dto.login,
      sex: dto.sex,
      email: dto.email,
      birthday: dto.birthday,
      password: dto.password,
      first_name: dto.first_name,
      last_name: dto.last_name,
    })

    const createdAccount = await this.accountRepository.create(account)

    createdAccount.create()
    createdAccount.commit()

    return createdAccount
  }
}

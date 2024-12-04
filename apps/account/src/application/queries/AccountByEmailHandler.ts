import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { AccountRepository } from '../../infrastructure/AccountRepository'
import { IAccount } from '../../domain/Account'

import { AccountByEmailQuery } from './AccountByEmailQuery'
import { InjectionToken } from '../injection-token'

@QueryHandler(AccountByEmailQuery)
export class AccountByEmailHandler
  implements IQueryHandler<AccountByEmailQuery, IAccount | null>
{
  @Inject(InjectionToken.ACCOUNT_REPOSITORY)
  accountRepository: AccountRepository

  async execute(dto: AccountByEmailQuery): Promise<IAccount | null> {
    return await this.accountRepository.findByEmail(dto.email)
  }
}

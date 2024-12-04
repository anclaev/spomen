import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { AccountRepository } from '../../infrastructure/AccountRepository'
import { IAccount } from '../../domain/Account'

import { AccountByLoginQuery } from './AccountByLoginQuery'
import { InjectionToken } from '../injection-token'

@QueryHandler(AccountByLoginQuery)
export class AccountByLoginHandler
  implements IQueryHandler<AccountByLoginQuery, IAccount | null>
{
  @Inject(InjectionToken.ACCOUNT_REPOSITORY)
  accountRepository: AccountRepository

  async execute(dto: AccountByLoginQuery): Promise<IAccount | null> {
    return await this.accountRepository.findByLogin(dto.login)
  }
}

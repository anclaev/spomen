import { AccountRole, AccountStatus } from '@prisma/client'
import { EventPublisher } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { AccountMeta } from '../infrastructure/entities/account.entity'
import { Account, AccountProps, IAccount } from './Account'

type CreateAccountOptions = {
  email: string
  username: string
  password: string
  pin_code?: string
  status?: AccountStatus
  roles?: AccountRole[]
  meta?: AccountMeta
}

export class AccountFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher

  create(options: CreateAccountOptions): IAccount {
    return this.eventPublisher.mergeObjectContext(
      new Account({
        ...options,
      })
    )
  }

  reconstitute(props: AccountProps): IAccount {
    return this.eventPublisher.mergeObjectContext(new Account(props))
  }
}

import { EventPublisher } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { Account, AccountProps, IAccount } from './Account'

type CreateAccountOptions = {
  login?: string
  email: string
  password: string
  first_name?: string
  last_name?: string
  birthday?: Date
  sex?: 0 | 1 | 2
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

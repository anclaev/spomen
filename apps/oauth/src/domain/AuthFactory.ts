import { EventPublisher } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { Auth, AuthProps, IAuth } from './Auth'

type CreateAuthOptions = {
  account_id?: string
}

export class AuthFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher

  create(options: CreateAuthOptions): IAuth {
    return this.eventPublisher.mergeObjectContext(
      new Auth({
        ...options,
      })
    )
  }

  reconstitute(props: AuthProps): IAuth {
    return this.eventPublisher.mergeObjectContext(new Auth(props))
  }
}

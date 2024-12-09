import { EventPublisher } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { ISession, Session, SessionProps } from './Session'

type CreateSessionOptions = {
  client_id: string
  account_id: string
  refresh_token: string
  meta: {
    expired_at: Date
  }
}

export class SessionFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher

  create(options: CreateSessionOptions): ISession {
    return this.eventPublisher.mergeObjectContext(new Session({ ...options }))
  }

  reconstitute(props: SessionProps): ISession {
    return this.eventPublisher.mergeObjectContext(new Session(props))
  }
}

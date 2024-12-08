import { EventPublisher } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { OAUTH_CLIENT_SCOPES } from '../infrastructure/Enums'

import { IOAuthClient, OAuthClient, OAuthClientProps } from './OAuthClient'

type CreateOAuthClientOptions = {
  name: string
  domain: string
  scopes?: OAUTH_CLIENT_SCOPES[]
}

export class OAuthClientFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher

  create(options: CreateOAuthClientOptions): IOAuthClient {
    return this.eventPublisher.mergeObjectContext(
      new OAuthClient({ ...options })
    )
  }

  reconstitute(props: OAuthClientProps): IOAuthClient {
    return this.eventPublisher.mergeObjectContext(new OAuthClient(props))
  }
}

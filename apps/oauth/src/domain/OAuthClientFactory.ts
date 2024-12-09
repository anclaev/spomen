import { OAuthClientGrantType } from '@prisma/client'
import { EventPublisher } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'

import { IOAuthClient, OAuthClient, OAuthClientProps } from './OAuthClient'

type CreateOAuthClientOptions = {
  name: string
  domain: string
  redirect_urls: string[]
  grants?: OAuthClientGrantType[]
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

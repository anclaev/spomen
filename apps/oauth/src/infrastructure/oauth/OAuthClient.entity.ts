import { OAuthClientGrantType } from '@prisma/client'
import { RootEntity } from '@spomen/core'

import { SessionEntity } from '../entities/session.entity'

export class OAuthClientEntity extends RootEntity {
  name: string
  domain: string
  grants: OAuthClientGrantType[]
  redirect_urls: string[]
  sessions?: SessionEntity[]
}

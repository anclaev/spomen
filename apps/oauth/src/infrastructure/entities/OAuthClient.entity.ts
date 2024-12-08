import { RootEntity } from '@spomen/core'

import { OAUTH_CLIENT_SCOPES } from '../Enums'

import { SessionEntity } from './session.entity'

export class OAuthClientEntity extends RootEntity {
  name: string
  domain: string
  scopes?: OAUTH_CLIENT_SCOPES[]
  sessions?: SessionEntity[]
}

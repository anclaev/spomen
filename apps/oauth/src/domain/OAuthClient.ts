import { AggregateRoot } from '@nestjs/cqrs'

import { SessionEntity } from '../infrastructure/entities/session.entity'
import { OAUTH_CLIENT_SCOPES } from '../infrastructure/Enums'

export type OAuthClientEssentialProps = Readonly<
  Required<{
    name: string
    domain: string
  }>
>

export type OAuthClientOptionalProps = Readonly<
  Partial<{
    id: string
    version: number
    scopes: OAUTH_CLIENT_SCOPES[]
    created_at: Date
    updated_at: Date
    sessions: SessionEntity[]
  }>
>

export type OAuthClientProps = OAuthClientEssentialProps &
  OAuthClientOptionalProps

export interface IOAuthClient extends AggregateRoot {
  getId(): string
  getScopes(): OAUTH_CLIENT_SCOPES[]
}

export class OAuthClient extends AggregateRoot implements IOAuthClient {
  private readonly id?: string
  private version?: number
  private name: string
  private domain: string
  private scopes?: OAUTH_CLIENT_SCOPES[]
  private readonly sessions?: SessionEntity[]
  private readonly created_at?: Date
  private updated_at?: Date

  constructor(props: OAuthClientProps) {
    super()
    // noinspection TypeScriptValidateTypes
    Object.assign(this, props)
  }

  getId(): string {
    return this.id
  }

  getScopes(): OAUTH_CLIENT_SCOPES[] {
    return this.scopes
  }
}

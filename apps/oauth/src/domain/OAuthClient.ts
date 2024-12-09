import { OAuthClientGrantType } from '@prisma/client'
import { AggregateRoot } from '@nestjs/cqrs'

import { SessionEntity } from '../infrastructure/entities/session.entity'

export type OAuthClientEssentialProps = Readonly<
  Required<{
    name: string
    domain: string
    redirect_urls: string[]
  }>
>

export type OAuthClientOptionalProps = Readonly<
  Partial<{
    id: string
    version: number
    grants: OAuthClientGrantType[]
    created_at: Date
    updated_at: Date
    sessions: SessionEntity[]
  }>
>

export type OAuthClientProps = OAuthClientEssentialProps &
  OAuthClientOptionalProps

export interface IOAuthClient extends AggregateRoot {
  getId(): string
  getGrants(): OAuthClientGrantType[]
  getRedirectUrls(): string[]
}

export class OAuthClient extends AggregateRoot implements IOAuthClient {
  private readonly id?: string
  private version?: number
  private name: string
  private domain: string
  private redirect_urls: string[]
  private grants?: OAuthClientGrantType[]
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

  getGrants(): OAuthClientGrantType[] {
    return this.grants
  }

  getRedirectUrls(): string[] {
    return this.redirect_urls
  }
}

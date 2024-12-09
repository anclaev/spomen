import { OAuthClientGrantType } from '@prisma/client'
import { AggregateRoot } from '@nestjs/cqrs'
import argon2 from 'argon2'

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
    secret: string
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
  setSecret(secret: string): void
  verifySecret(secret: string): boolean
  generateSecret(): Promise<string>
  getGrants(): OAuthClientGrantType[]
  getRedirectUrls(): string[]
}

export class OAuthClient extends AggregateRoot implements IOAuthClient {
  private readonly id?: string
  private version?: number
  private name: string
  private domain: string
  private secret: string
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

  async generateSecret(): Promise<string> {
    return argon2.hash(`${this.id}-${this.version}-${this.domain}`)
  }

  setSecret(secret: string) {
    this.secret = secret
  }

  verifySecret(secret: string) {
    return this.secret === secret
  }

  getRedirectUrls(): string[] {
    return this.redirect_urls
  }
}

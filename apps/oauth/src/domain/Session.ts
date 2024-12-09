import { SessionStatus } from '@prisma/client'
import { AggregateRoot } from '@nestjs/cqrs'

import { SessionMeta } from '../infrastructure/entities/session.entity'

export type SessionEssentialProps = Readonly<
  Required<{
    client_id: string
    account_id: string
    refresh_token: string
  }>
>

export type SessionOptionalProps = Readonly<
  Partial<{
    id: string
    version: number
    status: SessionStatus
    meta: SessionMeta
    created_at: Date
    updated_at: Date
  }>
>

export type SessionProps = SessionEssentialProps & SessionOptionalProps

export interface ISession extends AggregateRoot {
  getRefreshToken(): string
  getStatus(): SessionStatus
  getExpiredAt(): Date | null
  update(refresh_token: string, expired_at: Date): void
}

export class Session extends AggregateRoot implements ISession {
  private readonly id?: string
  private version?: number
  private client_id: string
  private account_id: string
  private refresh_token: string
  private status?: SessionStatus
  private readonly created_at?: Date
  private updated_at?: Date
  private meta?: SessionMeta = {
    expired_at: null,
  }

  constructor(props: SessionProps) {
    super()
    // noinspection TypeScriptValidateTypes
    Object.assign(this, props)
  }

  getRefreshToken(): string {
    return this.refresh_token
  }

  update(refresh_token: string, expired_at: Date) {
    this.refresh_token = refresh_token
    this.meta.expired_at = expired_at
  }

  getStatus(): SessionStatus {
    return this.status
  }

  getExpiredAt(): Date | null {
    return this.meta ? this.meta.expired_at : null
  }
}

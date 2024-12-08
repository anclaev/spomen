import { AccountRole, AccountStatus } from '@prisma/client'
import { AggregateRoot } from '@nestjs/cqrs'
import moment from 'moment'

import { AccountMeta } from '../infrastructure/entities/account.entity'

import { AccountRegisteredEvent } from './events/AccountRegisteredEvent'
import { SessionEntity } from '../infrastructure/entities/session.entity'

export type AccountEssentialProps = Readonly<
  Required<{
    username: string
    email: string
    password: string
  }>
>

export type AccountOptionalProps = Readonly<
  Partial<{
    id: string
    version: number
    pin_code: string
    roles: AccountRole[]
    status: AccountStatus
    meta: AccountMeta
    created_at: Date
    updated_at: Date
    sessions?: SessionEntity[]
  }>
>

export type AccountProps = AccountEssentialProps & AccountOptionalProps

export interface IAccount extends AggregateRoot {
  create(client_id: string): void
  getVersion(): number
  getStatus(): AccountStatus
  getEmail(): string
  getUsername(): string
  getId(): string
  changeStatus(status: AccountStatus): void
  confirm(): void
}

export class Account extends AggregateRoot implements IAccount {
  private readonly id?: string
  private username: string
  private email: string
  private password: string
  private version?: number
  private pin_code?: string
  private roles?: AccountRole[]
  private status?: AccountStatus
  private readonly created_at?: Date
  private updated_at?: Date
  private readonly sessions?: SessionEntity[]
  private meta?: AccountMeta = {
    confirmed_at: null,
    blocked_at: null,
    blocked_by: null,
    blocked_msg: null,
    password_updated_at: null,
    removed_at: null,
  }

  constructor(props: AccountProps) {
    super()
    // noinspection TypeScriptValidateTypes
    Object.assign(this, props)
  }

  getVersion() {
    return this.version
  }

  getStatus() {
    return this.status
  }

  getEmail(): string {
    return this.email
  }

  getId(): string {
    return this.id
  }

  getUsername(): string {
    return this.username
  }

  changeStatus(status: AccountStatus) {
    this.status = status
  }

  confirm() {
    if (this.status === 'CREATED' || this.status === 'PENDING') {
      this.status = 'COMFIRMED'
      this.meta.confirmed_at = moment().toISOString()
    }
  }

  create(client_id: string) {
    this.apply(new AccountRegisteredEvent(client_id, this))
  }
}

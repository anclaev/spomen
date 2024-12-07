import { AccountRole, AccountStatus } from '@prisma/client'
import { AggregateRoot } from '@nestjs/cqrs'

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
  create(): void
}

export class Account extends AggregateRoot implements IAccount {
  private readonly id?: string
  private readonly username: string
  private readonly email: string
  private readonly password: string
  private readonly version?: number
  private readonly pin_code?: string
  private readonly roles?: AccountRole[]
  private readonly status?: AccountStatus
  private readonly meta?: AccountMeta
  private readonly created_at?: Date
  private readonly updated_at?: Date
  private readonly sessions?: SessionEntity[]

  constructor(props: AccountProps) {
    super()
    // noinspection TypeScriptValidateTypes
    Object.assign(this, props)
  }

  create() {
    this.apply(new AccountRegisteredEvent(this.id))
  }
}

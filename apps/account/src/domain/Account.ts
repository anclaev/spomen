import { UnprocessableEntityException } from '@nestjs/common'
import { AccountRole, AccountStatus } from '@prisma/client'
import { AggregateRoot } from '@nestjs/cqrs'

import { AccountMeta } from '../infrastructure/AccountEntity'

import { AccountCreatedEvent } from './events/AccountCreatedEvent'
import { AccountRemovedEvent } from './events/AccountRemovedEvent'
import { PasswordUpdatedEvent } from './events/PasswordUpdateEvent'
import { PasskeyUpdatedEvent } from './events/PasskeyUpdateEvent'

export type AccountEssentialProps = Readonly<
  Required<{
    email: string
    password: string
  }>
>

export type AccountOptionalProps = Readonly<
  Partial<{
    sex: 0 | 1 | 2
    id: string
    status: AccountStatus
    roles: AccountRole[]
    created_at: Date
    login: string
    passkey: string
    meta: AccountMeta
    first_name: string
    last_name: string
    birthday: Date
  }>
>

export type AccountProps = AccountEssentialProps & AccountOptionalProps

export interface IAccount {
  updatePassword(password: string): void
  updatePasskey(passkey: string): void
  changeBirthday(date: Date): void
  lock(lockerId: string, msg: string): void
  create(): void
  remove(): void
  commit(): void
}

export class Account extends AggregateRoot implements IAccount {
  private readonly id: string
  private readonly login: string | null
  private readonly email: string
  private password: string
  private passkey: string | null
  private status: AccountStatus
  private readonly roles: AccountRole[]
  private readonly meta: AccountMeta | null
  private readonly first_name: string | null
  private readonly last_name: string | null
  private birthday: Date | null
  private readonly sex: 0 | 1 | 2
  private readonly created_at: Date

  constructor(props: AccountProps) {
    super()
    // noinspection TypeScriptValidateTypes
    Object.assign(this, props)
  }

  updatePassword(password: string): void {
    this.password = password

    this.apply(new PasswordUpdatedEvent(this.id))
  }

  updatePasskey(passkey: string): void {
    this.passkey = passkey

    this.apply(new PasskeyUpdatedEvent(this.id))
  }

  changeBirthday(date: Date): void {
    this.birthday = date
  }

  lock(lockerId: string, msg: string): void {
    if (this.meta && this.meta.locked_at) {
      throw new UnprocessableEntityException('Аккаунт уже заблокирован')
    }

    this.meta.locked_at = new Date()
    this.meta.locked_by = lockerId
    this.meta.locked_msg = msg
    this.status = 'LOCKED'
  }

  create(): void {
    this.apply(new AccountCreatedEvent(this.id))
  }

  remove(): void {
    if (this.status === 'REMOVED') {
      throw new UnprocessableEntityException('Аккаунт уже удалён')
    }

    this.meta.removed_at = new Date()
    this.status = 'REMOVED'

    this.apply(new AccountRemovedEvent(this.id))
  }
}

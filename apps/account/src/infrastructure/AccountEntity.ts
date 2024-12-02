import { Account, AccountRole, AccountStatus } from '@prisma/client'
import { BaseEntity } from '@spomen/core'

export type AccountMeta = Partial<{
  locked_by: string
  locked_msg: string
  locked_at: Date
  marked_at: Date
  confirmed_at: Date
  removed_at: Date
}>

export class AccountEntity extends BaseEntity implements Account {
  login: string
  email: string
  password: string
  passkey: string
  status: AccountStatus
  roles: AccountRole[]
  meta: any
  first_name: string
  last_name: string
  birthday: Date
  sex: number
}

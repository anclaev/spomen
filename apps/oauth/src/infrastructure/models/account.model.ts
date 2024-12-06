import { Account, AccountRole, AccountStatus } from '@prisma/client'
import { RootModel } from '@spomen/core'

import { SessionModel } from './session.model'

export type AccountMeta = Partial<{
  blocked_by: string
  blocked_msg: string
  blocked_at: string
  confirmed_at: string
  removed_at: string
  password_updated_at: string
}>

export class AccountModel extends RootModel implements Account {
  username: string
  email: string
  password: string
  pin_code: string | null
  roles: AccountRole[]
  status: AccountStatus
  sessions?: SessionModel[]
  meta: AccountMeta | null
}

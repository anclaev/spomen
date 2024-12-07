import { AccountRole, AccountStatus } from '@prisma/client'
import { RootEntity } from '@spomen/core'

import { SessionEntity } from './session.entity'

export type AccountMeta = Partial<{
  blocked_by: string
  blocked_msg: string
  blocked_at: string
  confirmed_at: string
  removed_at: string
  password_updated_at: string
}>

export class AccountEntity extends RootEntity {
  username: string
  email: string
  password: string
  pin_code?: string
  roles?: AccountRole[]
  status?: AccountStatus
  sessions?: SessionEntity[]
  meta?: AccountMeta
}

import { Account, AccountRole, AccountStatus } from '@prisma/client'
import { RootModel } from '@spomen/core'

import { SessionModel } from './session.model'

export class AccountModel extends RootModel implements Account {
  username: string
  email: string
  password: string
  pin_code: string | null
  roles: AccountRole[]
  status: AccountStatus
  sessions?: SessionModel[]
  meta: object | null
}

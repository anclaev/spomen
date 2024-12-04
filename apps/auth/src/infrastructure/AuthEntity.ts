import { BaseEntity } from '@spomen/core'
import { Auth } from '@prisma/client'

export class AuthEntity extends BaseEntity implements Auth {
  account_id: string
  refresh_token: string
  updated_at: Date
}

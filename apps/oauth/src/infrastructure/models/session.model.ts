import { Session, SessionStatus } from '@prisma/client'
import { RootModel } from '@spomen/core'

export class SessionModel extends RootModel implements Session {
  refresh_token: string
  status: SessionStatus
  account_id: string
  meta: object | null
}

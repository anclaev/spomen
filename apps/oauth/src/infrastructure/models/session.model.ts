import { Session, SessionStatus } from '@prisma/client'
import { RootModel } from '@spomen/core'

export type SessionMeta = Partial<{
  expired_at: string
}>

export class SessionModel extends RootModel implements Session {
  refresh_token: string
  status: SessionStatus
  account_id: string
  meta: SessionMeta | null
}

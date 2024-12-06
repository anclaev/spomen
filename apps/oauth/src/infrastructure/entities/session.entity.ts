import { RootEntity } from '@spomen/core'
import { SessionStatus } from '@prisma/client'

export type SessionMeta = Partial<{
  expired_at: Date
}>

export class SessionEntity extends RootEntity {
  refresh_token: string
  status: SessionStatus
  account_id: string
  meta?: SessionMeta
}

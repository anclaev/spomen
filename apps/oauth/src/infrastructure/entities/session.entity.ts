import { SessionStatus } from '@prisma/client'
import { RootEntity } from '@spomen/core'

export type SessionMeta = Partial<{
  expired_at: Date
}>

export class SessionEntity extends RootEntity {
  refresh_token: string
  status: SessionStatus
  account_id: string
  client_id: string
  meta?: SessionMeta
}

import { PrismaProvider } from '@spomen/core'
import { Inject } from '@nestjs/common'
import { Writeable } from 'zod'
import moment from 'moment'

import { InjectionToken } from '../../app/injection-token'

import { ISession, SessionProps } from '../../domain/Session'
import { SessionFactory } from '../../domain/SessionFactory'

import { SessionEntity } from '../entities/session.entity'

export interface ISessionRepository {
  create: (session: ISession) => Promise<ISession>
  findById: (id: string) => Promise<ISession | null>
  findByRefreshToken: (refresh_token: string) => Promise<ISession | null>
  getSessionsCount(account_id: string, client_id: string): Promise<number>
  update: (id: string, data: ISession) => Promise<ISession | null>
  remove: (id: string) => Promise<boolean>
}

export class SessionRepository implements ISessionRepository {
  constructor(
    @Inject(InjectionToken.PRISMA_PROVIDER)
    private readonly prisma: PrismaProvider,
    @Inject(SessionFactory) private readonly factory: SessionFactory
  ) {}

  async create(session: ISession): Promise<ISession> {
    const entity = this.modelToEntity(session)

    const created = await this.prisma.session.create({
      data: {
        ...entity,
      },
    })

    return this.entityToModel(created as SessionEntity)
  }

  async update(id: string, session: ISession): Promise<ISession | null> {
    const entity = this.modelToEntity(session)

    const updated = await this.prisma.session.update({
      where: {
        id,
      },
      data: {
        ...entity,
        version: entity.version + 1,
        updated_at: moment().toDate(),
      },
    })

    return updated ? this.entityToModel(updated as SessionEntity) : null
  }

  async findById(id: string): Promise<ISession | null> {
    const session = await this.prisma.session.findUnique({
      where: {
        id,
      },
    })

    return session ? this.entityToModel(session as SessionEntity) : null
  }

  async findByRefreshToken(refresh_token: string): Promise<ISession | null> {
    const session = await this.prisma.session.findUnique({
      where: {
        refresh_token,
      },
    })

    return session ? this.entityToModel(session as SessionEntity) : null
  }

  async getSessionsCount(
    account_id: string,
    client_id: string
  ): Promise<number> {
    return this.prisma.session.count({
      where: {
        client_id: {
          equals: client_id,
        },
        account_id: {
          equals: account_id,
        },
      },
    })
  }

  async remove(id: string): Promise<boolean> {
    const removed = await this.prisma.session.delete({
      where: { id },
    })

    return !!removed
  }

  private modelToEntity(model: ISession): SessionEntity {
    const props = JSON.parse(JSON.stringify(model)) as Writeable<SessionProps>

    return <SessionEntity>{ ...props }
  }

  private entityToModel(entity: SessionEntity): ISession {
    return this.factory.reconstitute({ ...entity })
  }
}

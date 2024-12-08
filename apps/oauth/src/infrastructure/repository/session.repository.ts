import { PrismaProvider } from '@spomen/core'
import { Inject } from '@nestjs/common'

import { InjectionToken } from '../../app/injection-token'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISessionRepository {
  // create: (session: SessionModel) => Promise<SessionModel>
  // findById: (id: string) => Promise<SessionModel | null>
  // update: (id: string, data: SessionModel) => Promise<SessionModel | null>
  // remove: (id: string) => Promise<boolean>
}

export class SessionRepository implements ISessionRepository {
  constructor(
    @Inject(InjectionToken.PRISMA_PROVIDER)
    private readonly prisma: PrismaProvider
  ) {}

  // async create(data: SessionModel): Promise<SessionModel> {
  //   return (await this.prisma.session.create({
  //     data,
  //   })) as unknown as SessionModel
  // }
  //
  // async findById(id: string): Promise<SessionModel | null> {
  //   const session = await this.prisma.session.findUnique({
  //     where: {
  //       id,
  //     },
  //   })
  //
  //   return session ? (session as unknown as SessionModel) : null
  // }
  //
  // async update(id: string, data: SessionModel): Promise<SessionModel | null> {
  //   const updated = await this.prisma.session.update({
  //     where: { id },
  //     data,
  //   })
  //
  //   return updated ? (updated as unknown as SessionModel) : null
  // }
  //
  // async remove(id: string): Promise<boolean> {
  //   const removed = await this.prisma.session.delete({
  //     where: { id },
  //   })
  //
  //   return !!removed
  // }
}

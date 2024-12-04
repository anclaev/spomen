import { PrismaProvider, Writeable } from '@spomen/core'
import { Inject } from '@nestjs/common'

import { InjectionToken } from '../application/injection-token'

import { IAuthRepository } from '../domain/IAuthRepository'
import { AuthFactory } from '../domain/AuthFactory'
import { AuthProps, IAuth } from '../domain/Auth'

import { AuthEntity } from './AuthEntity'

export class AuthRepository implements IAuthRepository {
  constructor(
    @Inject(InjectionToken.PRISMA_PROVIDER)
    private readonly prisma: PrismaProvider,
    @Inject() private readonly authFactory: AuthFactory
  ) {}

  async create(auth: IAuth): Promise<IAuth> {
    const entity = this.modelToEntity(auth)

    const created = await this.prisma.auth.create({
      data: entity,
    })

    return this.entityToModel(created as AuthEntity)
  }

  async findById(id: string): Promise<IAuth | null> {
    const auth = await this.prisma.auth.findUnique({
      where: {
        id,
      },
    })

    return auth ? this.entityToModel(auth as AuthEntity) : null
  }

  async findByRefreshToken(refresh_token: string): Promise<IAuth | null> {
    const auth = await this.prisma.auth.findUnique({
      where: {
        refresh_token,
      },
    })

    return auth ? this.entityToModel(auth as AuthEntity) : null
  }

  async findByAccountId(account_id: string): Promise<IAuth[]> {
    const tokens = await this.prisma.auth.findMany({
      where: {
        account_id,
      },
    })

    return tokens.map((token) => this.entityToModel(token))
  }

  async update(oldToken: string, newToken: string): Promise<IAuth | null> {
    const updated = await this.prisma.auth.update({
      where: {
        refresh_token: oldToken,
      },
      data: {
        refresh_token: newToken,
        updated_at: new Date(),
      },
    })

    return updated ? this.entityToModel(updated as AuthEntity) : null
  }

  async delete(refresh_token: string): Promise<boolean> {
    const deletedToken = await this.prisma.auth.delete({
      where: {
        refresh_token,
      },
    })

    return !!deletedToken
  }

  private modelToEntity(model: IAuth): AuthEntity {
    const props = JSON.parse(JSON.stringify(model)) as Writeable<AuthProps>

    return <AuthEntity>{
      ...props,
    }
  }

  private entityToModel(entity: AuthEntity): IAuth {
    return this.authFactory.reconstitute({
      ...entity,
    })
  }
}

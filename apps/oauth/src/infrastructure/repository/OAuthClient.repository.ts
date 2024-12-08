import { PrismaProvider } from '@spomen/core'
import { Inject } from '@nestjs/common'
import moment from 'moment'
import { Writeable } from 'zod'

import { InjectionToken } from '../../app/injection-token'

import { IOAuthClient, OAuthClientProps } from '../../domain/OAuthClient'
import { OAuthClientFactory } from '../../domain/OAuthClientFactory'

import { OAuthClientEntity } from '../entities/OAuthClient.entity'

export interface IOAuthClientRepository {
  create: (client: IOAuthClient) => Promise<IOAuthClient>
  findById: (id: string) => Promise<IOAuthClient | null>
  findByName: (name: string) => Promise<IOAuthClient | null>
  findByDomain: (domain: string) => Promise<IOAuthClient | null>
  update: (id: string, client: IOAuthClient) => Promise<IOAuthClient>
}

export class OAuthClientRepository implements IOAuthClientRepository {
  constructor(
    @Inject(InjectionToken.PRISMA_PROVIDER)
    private readonly prisma: PrismaProvider,
    @Inject(OAuthClientFactory) private readonly factory: OAuthClientFactory
  ) {}

  async create(client: IOAuthClient): Promise<IOAuthClient> {
    const entity = this.modelToEntity(client)

    const created = await this.prisma.oAuthClient.create({
      data: {
        ...entity,
        sessions: undefined,
      },
    })

    return this.entityToModel(created as OAuthClientEntity)
  }

  async update(id: string, client: IOAuthClient): Promise<IOAuthClient | null> {
    const entity = this.modelToEntity(client)

    const updated = await this.prisma.oAuthClient.update({
      where: { id },
      data: {
        ...entity,
        sessions: undefined,
        version: entity.version++,
        updated_at: moment().toDate(),
      },
    })

    return updated ? this.entityToModel(updated as OAuthClientEntity) : null
  }

  async findById(id: string): Promise<IOAuthClient | null> {
    const client = await this.prisma.oAuthClient.findUnique({
      where: {
        id,
      },
    })

    return client ? this.entityToModel(client as OAuthClientEntity) : null
  }

  async findByName(name: string): Promise<IOAuthClient | null> {
    const client = await this.prisma.oAuthClient.findUnique({
      where: {
        name,
      },
    })

    return client ? this.entityToModel(client as OAuthClientEntity) : null
  }

  async findByDomain(domain: string): Promise<IOAuthClient | null> {
    const client = await this.prisma.oAuthClient.findUnique({
      where: {
        domain,
      },
    })

    return client ? this.entityToModel(client as OAuthClientEntity) : null
  }

  private modelToEntity(model: IOAuthClient): OAuthClientEntity {
    const props = JSON.parse(
      JSON.stringify(model)
    ) as Writeable<OAuthClientProps>

    return <OAuthClientEntity>{
      ...props,
    }
  }

  private entityToModel(entity: OAuthClientEntity): IOAuthClient {
    return this.factory.reconstitute({
      ...entity,
    })
  }
}

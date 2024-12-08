import { PrismaProvider } from '@spomen/core'
import { Inject } from '@nestjs/common'
import moment from 'moment/moment'
import { Writeable } from 'zod'

import { InjectionToken } from '../../app/injection-token'

import { AccountProps, IAccount } from '../../domain/Account'
import { AccountFactory } from '../../domain/AccountFactory'

import { AccountEntity } from '../entities/account.entity'

export interface IAccountRepository {
  create: (account: IAccount) => Promise<IAccount>
  findById: (id: string) => Promise<IAccount | null>
  findByUsername: (username: string) => Promise<IAccount | null>
  findByEmail: (email: string) => Promise<IAccount | null>
  update: (id: string, account: IAccount) => Promise<IAccount | null>
}

export class AccountRepository implements IAccountRepository {
  constructor(
    @Inject(InjectionToken.PRISMA_PROVIDER)
    private readonly prisma: PrismaProvider,
    @Inject(AccountFactory)
    private readonly factory: AccountFactory
  ) {}

  async create(account: IAccount): Promise<IAccount> {
    const entity = this.modelToEntity(account)

    const created = await this.prisma.account.create({
      data: {
        ...entity,
        sessions: undefined,
      },
    })

    return this.entityToModel(created as AccountEntity)
  }

  async update(id: string, account: IAccount): Promise<IAccount | null> {
    const entity = this.modelToEntity(account)

    const updated = await this.prisma.account.update({
      where: {
        id,
      },
      data: {
        ...entity,
        sessions: undefined,
        version: entity.version++,
        updated_at: moment().toDate(),
      },
    })

    return updated ? this.entityToModel(updated as AccountEntity) : null
  }

  async findById(id: string): Promise<IAccount | null> {
    const account = await this.prisma.account.findUnique({
      where: {
        id,
      },
    })

    return account ? this.entityToModel(account as AccountEntity) : null
  }

  async findByEmail(email: string): Promise<IAccount | null> {
    const account = await this.prisma.account.findUnique({
      where: {
        email,
      },
    })
    return account ? this.entityToModel(account as AccountEntity) : null
  }

  async findByUsername(username: string): Promise<IAccount | null> {
    const account = await this.prisma.account.findUnique({
      where: {
        username,
      },
    })
    return account ? this.entityToModel(account as AccountEntity) : null
  }

  private modelToEntity(model: IAccount): AccountEntity {
    const props = JSON.parse(JSON.stringify(model)) as Writeable<AccountProps>

    return <AccountEntity>{
      ...props,
    }
  }

  private entityToModel(entity: AccountEntity): IAccount {
    return this.factory.reconstitute({
      ...entity,
    })
  }
}

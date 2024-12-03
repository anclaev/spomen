import { PrismaProvider, Writeable } from '@spomen/core'
import { Inject } from '@nestjs/common'

import { InjectionToken } from '../application/injection-token'

import { IAccountRepository } from '../domain/IAccountRepository'
import { AccountProps, IAccount } from '../domain/Account'
import { AccountFactory } from '../domain/AccountFactory'

import { AccountEntity } from './AccountEntity'

export class AccountRepository implements IAccountRepository {
  constructor(
    @Inject(InjectionToken.PRISMA_PROVIDER)
    private readonly prisma: PrismaProvider,
    @Inject() private readonly accountFactory: AccountFactory
  ) {}

  async create(account: IAccount): Promise<IAccount> {
    const entity = this.modelToEntity(account)

    const created = await this.prisma.account.create({
      data: entity,
    })

    return this.entityToModel(created as AccountEntity)
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

  async findByLogin(login: string): Promise<IAccount | null> {
    const account = await this.prisma.account.findUnique({
      where: {
        login,
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
    return this.accountFactory.reconstitute({
      ...entity,
      sex: entity.sex as 0 | 1 | 2,
    })
  }
}

import { PrismaProvider } from '@spomen/core'
import { Inject } from '@nestjs/common'

import { InjectionToken } from '../../app/injection-token'
import { AccountModel } from '../models/account.model'

export interface IAccountRepository {
  create: (account: Omit<AccountModel, 'sessions'>) => Promise<AccountModel>
  findById: (id: string) => Promise<AccountModel | null>
  findByUsername: (username: string) => Promise<AccountModel | null>
  findByEmail: (email: string) => Promise<AccountModel | null>
  update: (
    id: string,
    account: Omit<AccountModel, 'sessions'>
  ) => Promise<AccountModel | null>
  remove: (id) => Promise<boolean>
}

export class AccountRepository implements IAccountRepository {
  constructor(
    @Inject(InjectionToken.PRISMA_PROVIDER)
    private readonly prisma: PrismaProvider
  ) {}

  async create(data: Omit<AccountModel, 'sessions'>): Promise<AccountModel> {
    return (await this.prisma.account.create({
      data,
    })) as unknown as AccountModel
  }

  async findById(id: string): Promise<AccountModel | null> {
    const account = await this.prisma.account.findUnique({ where: { id } })

    return account ? (account as unknown as AccountModel) : null
  }

  async findByUsername(username: string): Promise<AccountModel | null> {
    const account = await this.prisma.account.findUnique({
      where: { username },
    })

    return account ? (account as unknown as AccountModel) : null
  }

  async findByEmail(email: string): Promise<AccountModel | null> {
    const account = await this.prisma.account.findUnique({ where: { email } })

    return account ? (account as unknown as AccountModel) : null
  }

  async update(
    id: string,
    data: Omit<AccountModel, 'sessions'>
  ): Promise<AccountModel | null> {
    const updated = await this.prisma.account.update({ where: { id }, data })

    return updated ? (updated as unknown as AccountModel) : null
  }

  async remove(id: string): Promise<boolean> {
    const removed = await this.prisma.account.delete({
      where: { id },
    })

    return !!removed
  }
}

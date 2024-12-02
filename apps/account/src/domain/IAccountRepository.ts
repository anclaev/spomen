import { IAccount } from './Account'

export interface IAccountRepository {
  create: (account: IAccount) => Promise<IAccount>
  findById: (id: string) => Promise<IAccount | null>
  findByLogin: (login: string) => Promise<IAccount | null>
  findByEmail: (email: string) => Promise<IAccount | null>
}

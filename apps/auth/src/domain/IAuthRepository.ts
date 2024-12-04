import { IAuth } from './Auth'

export interface IAuthRepository {
  create: (account: IAuth) => Promise<IAuth>
  findById: (id: string) => Promise<IAuth | null>
  findByRefreshToken: (refresh_token: string) => Promise<IAuth | null>
  findByAccountId: (id: string) => Promise<IAuth[]>
}

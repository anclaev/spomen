// export type AccountEssentialProps = Readonly<
//   Required<{
//     username: string
//     email: string
//     password: string
//   }>
// >
//
// export type AccountOptionalProps = Readonly<
//   Partial<{
//     version: string
//     pin_code: string
//     roles: AccountRole[]
//     status: AccountStatus
//     meta: AccountMeta
//     created_at: Date
//     updated_at: Date
//   }>
// >
//
// export type AccountProps = AccountEssentialProps & AccountOptionalProps
//
// export type SessionEssentialProps = Readonly<
//   Required<{
//     refresh_token: string
//     account_id: string
//     meta: SessionMeta
//   }>
// >
//
// export type SessionOptionalProps = Readonly<
//   Partial<{
//     status: SessionStatus
//     created_at: Date
//     updated_at: Date
//   }>
// >
//
// export type SessionProps = SessionEssentialProps & SessionEssentialProps

import { AggregateRoot } from '@nestjs/cqrs'

export type AuthProps = {
  account_id?: string
}

export interface IAuth {
  login(dto: any): void
  logout(dto: any): void
  refresh(dto: any): void
  confirm(dto: any): void
}

export class Auth extends AggregateRoot implements IAuth {
  private readonly account_id?: string

  constructor(props: AuthProps) {
    super()
    // noinspection TypeScriptValidateTypes
    Object.assign(this, props)
  }

  login(dto: any) {
    console.log('login!')
  }
  logout(dto: any) {
    console.log('logout!')
  }
  refresh(dto: any) {
    console.log('refresh!')
  }
  confirm(dto: any) {
    console.log('confirm!')
  }
}

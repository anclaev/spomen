import { Observable } from 'rxjs'

import {
  AccountCredentialsWithPasskey,
  AccountCredentialsWithPassword,
  CreateAccountPayload,
  GetAccountByEmailPayload,
  GetAccountByLoginPayload,
  Status,
} from './'

export interface AccountService {
  GetAccountPasswordByLogin(
    payload: GetAccountByLoginPayload
  ): Observable<AccountCredentialsWithPassword>
  GetAccountPasswordByEmail(
    payload: GetAccountByEmailPayload
  ): Observable<AccountCredentialsWithPassword>
  GetAccountPasskeyByLogin(
    payload: GetAccountByLoginPayload
  ): Observable<AccountCredentialsWithPasskey>
  GetAccountPasskeyByEmail(
    payload: GetAccountByEmailPayload
  ): Observable<AccountCredentialsWithPasskey>
  CreateAccount(payload: CreateAccountPayload): Observable<Status>
}

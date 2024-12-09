import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@spomen/core'

import { OAuthClientRepository } from '../oauth/OAuthClient.repository'
import { AccountRepository } from '../repository/account.repository'
import { SessionRepository } from '../repository/session.repository'

import { ISession, Session } from '../../domain/Session'
import { IOAuthClient } from '../../domain/OAuthClient'
import { IAccount } from '../../domain/Account'

import { OAuthCredentialsType } from '../../app/dtos/OAuthCredentials.dto'

import { STATUS } from '../Enums'
import { ENV } from '../Config'

import { InjectionToken } from '../../app/injection-token'

export type ValidateUserResult = {
  account?: IAccount
  status: STATUS
}

export type ValidateClientResult = {
  client?: IOAuthClient
  status: STATUS
}

interface IAuthService {
  validateUser(credentials: OAuthCredentialsType): Promise<ValidateUserResult>

  validateClient(
    client_id: string,
    client_secret: string
  ): Promise<ValidateClientResult>

  getAuthenticatedUser(account_id: string): Promise<IAccount>

  createSession(
    id,
    refresh_token: string,
    client_id: string,
    account_id: string,
    expired_at: Date
  ): Promise<ISession>

  validateSessionLimit(client_id: string, account_id: string): Promise<boolean>
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly config: ConfigService,
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly account: AccountRepository,
    @Inject(InjectionToken.OAUTH_CLIENT_REPOSITORY)
    private readonly client: OAuthClientRepository,
    @Inject(InjectionToken.SESSION_REPOSITORY)
    private readonly session: SessionRepository
  ) {}

  async validateUser(
    credentials: OAuthCredentialsType
  ): Promise<ValidateUserResult> {
    const { email, username, password } = credentials

    let account: IAccount | null = null

    if (!email && !username) {
      return { status: STATUS.FAILED }
    }

    if (email) {
      account = await this.account.findByEmail(email.trim())
    }

    if (username) {
      account = await this.account.findByUsername(username.trim())
    }

    if (!account) return { status: STATUS.FAILED }

    const verified = await account.verifyPassword(password.trim())

    if (!verified) {
      return { status: STATUS.FAILED }
    }

    return {
      status: STATUS.SUCCESS,
      account,
    }
  }

  async validateClient(
    client_id: string,
    client_secret: string
  ): Promise<ValidateClientResult> {
    const oauth_client = await this.client.findById(client_id)

    if (!oauth_client) return { status: STATUS.FAILED }

    const verified = oauth_client.verifySecret(client_secret.trim())

    if (!verified) {
      return { status: STATUS.FAILED }
    }

    return { status: STATUS.SUCCESS, client: oauth_client }
  }

  async getAuthenticatedUser(account_id: string): Promise<IAccount> {
    return await this.account.findById(account_id)
  }

  async createSession(
    id,
    refresh_token: string,
    client_id: string,
    account_id: string,
    expired_at: Date
  ): Promise<ISession> {
    const session = new Session({
      refresh_token,
      client_id,
      account_id,
      id,
      meta: {
        expired_at,
      },
    })

    // TODO: Добавить обработку ошибки записи сессии в базу

    const created = await this.session.create(session)

    created.commit()

    return created
  }

  async validateSessionLimit(
    client_id: string,
    account_id: string
  ): Promise<boolean> {
    const sessions = await this.session.getSessionsCount(account_id, client_id)

    return sessions < Number(this.config.env<ENV>('MAX_SESSIONS'))
  }
}

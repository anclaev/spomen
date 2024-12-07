import OAuth2Server, {
  AuthorizationCode,
  AuthorizationCodeModel,
  Callback,
  Client,
  Falsey,
  PartialToken,
  RefreshToken,
  RefreshTokenModel,
  RequestAuthenticationModel,
  Scope,
  Token,
  User,
} from 'oauth2-server'

import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class OAuth2Service
  implements
    RequestAuthenticationModel,
    AuthorizationCodeModel,
    RefreshTokenModel
{
  constructor(private readonly jwt: JwtService) {}

  getAccessToken(
    accessToken: string,
    callback?: Callback<Token>
  ): Promise<Token | Falsey> {
    return new Promise((resolve) => resolve(null))
  }

  verifyScope(
    token: Token,
    scope: Scope,
    callback?: Callback<boolean>
  ): Promise<boolean> {
    return new Promise((resolve) => resolve(false))
  }

  validateScope(
    user: User,
    client: Client,
    scope: Scope,
    callback?: Callback<string | Falsey>
  ): Promise<Scope | Falsey> {
    return new Promise((resolve) => resolve(null))
  }

  generateAccessToken(
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    scope: OAuth2Server.Scope,
    callback?: OAuth2Server.Callback<string>
  ): Promise<string> {
    return new Promise((resolve) => resolve(''))
  }

  generateRefreshToken(
    client: Client,
    user: User,
    scope: Scope,
    callback?: Callback<string>
  ): Promise<string> {
    return new Promise((resolve) => resolve(''))
  }

  saveToken(
    token: PartialToken,
    client: Client,
    user: User,
    callback?: Callback<Token>
  ): Promise<Token | Falsey> {
    return new Promise((resolve) => resolve(false))
  }

  getClient(
    clientId: string,
    clientSecret: string,
    callback?: Callback<Client | Falsey>
  ): Promise<Client | Falsey> {
    return new Promise((resolve) => resolve(false))
  }

  generateAuthorizationCode(
    client: Client,
    user: User,
    scope: Scope,
    callback?: Callback<string>
  ): Promise<string> {
    return new Promise((resolve) => resolve(''))
  }

  getAuthorizationCode(
    authorizationCode: string,
    callback?: Callback<AuthorizationCode>
  ): Promise<AuthorizationCode | Falsey> {
    return new Promise((resolve) =>
      resolve({
        authorizationCode: 'test',
        client: {
          id: 'test',
          grants: ['test', 'test'],
          accessTokenLifetime: 11313,
          refreshTokenLifetime: 131313,
          redirectUris: 'test',
        },
        expiresAt: new Date(),
        redirectUri: 'test',
        scope: 'test',
        user: {
          login: 'test',
        },
      })
    )
  }

  revokeAuthorizationCode(
    code: AuthorizationCode,
    callback?: Callback<boolean>
  ): Promise<boolean> {
    return new Promise((resolve) => resolve(false))
  }

  saveAuthorizationCode(
    code: Pick<
      AuthorizationCode,
      'authorizationCode' | 'expiresAt' | 'redirectUri' | 'scope'
    >,
    client: Client,
    user: User,
    callback?: Callback<AuthorizationCode>
  ): Promise<AuthorizationCode | Falsey> {
    return new Promise((resolve) => resolve(false))
  }

  revokeToken(
    token: RefreshToken | Token,
    callback?: Callback<boolean>
  ): Promise<boolean> {
    return new Promise((resolve) => resolve(false))
  }

  getRefreshToken(
    refreshToken: string,
    callback?: Callback<RefreshToken>
  ): Promise<RefreshToken | Falsey> {
    return new Promise((resolve) => resolve(false))
  }
}

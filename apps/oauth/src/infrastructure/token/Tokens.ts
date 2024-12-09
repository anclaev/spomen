import { readFileSync } from 'fs'
import { join } from 'path'
import { Client, Scope } from 'oauth2-server'

export type RSAKeys = {
  publicKey: string
  privateKey: string
}

export const loadKeys = (): RSAKeys | Error => {
  try {
    return {
      publicKey: readFileSync(join(__dirname, 'keys/public.key'), 'utf-8'),
      privateKey: readFileSync(join(__dirname, 'keys/private.key'), 'utf-8'),
    }
  } catch (e) {
    return new Error('RSA-ключи не установлены')
  }
}

export interface IUser {
  id: string
  username: string
  email: string
}

export interface ITokenBasePayload {
  iat: number
  exp: number
  iss: string
  sub: string
}

export interface ITokenOAuthPayload {
  client: Client
  user: IUser
  scope?: Scope | undefined
}

export interface IAuthorizationCodePayload extends ITokenOAuthPayload {
  redirect_url: string | undefined
  expiresAt?: Date | undefined
}

export interface IAccessToken extends ITokenBasePayload, ITokenOAuthPayload {}

export interface IRefreshTokenPayload extends ITokenOAuthPayload {
  token_id: string
}

export interface IRefreshToken
  extends ITokenBasePayload,
    IRefreshTokenPayload {}

export interface IConfirmTokenPayload {
  version: number
  user: IUser
}

export interface IConfirmToken
  extends ITokenBasePayload,
    IConfirmTokenPayload {}

export type GenerateTokenPayload =
  | IAuthorizationCodePayload
  | ITokenOAuthPayload
  | IRefreshTokenPayload
  | IConfirmTokenPayload

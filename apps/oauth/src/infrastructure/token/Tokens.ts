import { readFileSync } from 'fs'
import { join } from 'path'

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

export interface ITokenWithoutPayload {
  iat: number
  exp: number
  iss: string
  sub: string
}

export interface IAccessTokenPayload {
  client_id: string
  account_id: string
  username: string
  email: string
}

export interface IAccessToken
  extends ITokenWithoutPayload,
    IAccessTokenPayload {}

export interface IRefreshTokenPayload extends IAccessTokenPayload {
  token_id: string
}

export interface IRefreshToken
  extends ITokenWithoutPayload,
    IRefreshTokenPayload {}

export interface IConfirmTokenPayload extends IAccessTokenPayload {
  version: number
}

export interface IConfirmToken
  extends ITokenWithoutPayload,
    IConfirmTokenPayload {}

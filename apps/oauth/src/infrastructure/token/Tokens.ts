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

export interface ITokenPayload {
  client_id: string
  account_id: string
  username: string
  email: string
}

export interface IRefreshPayload extends ITokenPayload {
  token_id: string
}

export interface IConfirmPayload extends ITokenPayload {
  version: number
}

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

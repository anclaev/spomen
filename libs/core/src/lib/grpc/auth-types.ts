import { z } from 'zod'

export type LoginOptionalFields = {
  login?: string
  email?: string
}

export const LoginOptionalFieldsSchema = z.object({
  login: z.string({ message: 'Некорректный логин' }).optional(),
  email: z.string({ message: 'Некорректный email' }).optional(),
})

export type LoginWithPasswordPayload = LoginOptionalFields & {
  password: string
}

export const LoginWithPasswordSchema = LoginOptionalFieldsSchema.extend({
  password: z.string({ message: 'Некорректный пароль' }),
})

export type LoginWithPasskeyPayload = LoginOptionalFields & {
  passkey?: string
}

export const LoginWithPasskeySchema = LoginOptionalFieldsSchema.extend({
  passkey: z.string({ message: 'Некорректный пин-код' }).optional(),
})

export type Tokens = {
  access_token: string
  refresh_token: string
}

export const TokensSchema = z.object({
  access_token: z.string({ message: 'Некорректный access token' }),
  refresh_token: z.string({ message: 'Некорректный refresh token' }),
})

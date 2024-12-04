import { z } from 'zod'

const invalidSexMessage = {
  message: 'Некорректный пол (0 - не указан, 1 - мужской, 2 - женский)',
}

export type GetAccountByLoginPayload = {
  login: string
}

export const GetAccountByLoginSchema = z.object({
  login: z.string({ message: 'Логин не предоставлен' }),
})

export type GetAccountByEmailPayload = {
  email: string
}

export const GetAccountByEmailSchema = z.object({
  email: z.string({ message: 'Email не предоставлен' }),
})

export type CreateAccountPayload = {
  login?: string
  email: string
  password: string
  first_name?: string
  last_name?: string
  birthday?: string
  sex?: number
}

export const CreateAccountSchema = z.object({
  login: z.string({ message: 'Некорректный логин' }).optional(),
  email: z
    .string({ message: 'Email не предоставлен' })
    .email({ message: 'Некорректный email' }),
  password: z
    .string({ message: 'Пароль не предоставлен' })
    .min(8, { message: 'Некорректный пароль' }),
  first_name: z.string({ message: 'Некорректное имя' }).optional(),
  last_name: z.string({ message: 'Некорректная фамилия' }).optional(),
  birthday: z
    .string({ message: 'Некорректная дата рождения' })
    .date()
    .optional(),
  sex: z
    .number(invalidSexMessage)
    .min(0, invalidSexMessage)
    .max(2, invalidSexMessage)
    .optional(),
})

export type AccountCredentials = {
  id: string
  email: string
  login?: string
}

export const AccountCredentialsSchema = z.object({
  id: z.string({ message: 'ID не предоставлен' }),
  email: z.string({ message: 'Логин не предоставлен' }),
  login: z.string({ message: 'Некорректный логин' }).optional(),
})

export type AccountCredentialsWithPassword = AccountCredentials & {
  password: string
}

export const AccountCredentialsWithPasswordSchema =
  AccountCredentialsSchema.extend({
    password: z.string({ message: 'Некорректный пароль' }),
  })

export type AccountCredentialsWithPasskey = AccountCredentials & {
  passkey?: string
}

export const AccountCredentialsWithPasskeySchema =
  AccountCredentialsSchema.extend({
    passkey: z.string({ message: 'Некорректный пин-код' }).optional(),
  })

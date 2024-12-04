import { z } from 'zod'

export const GetAccountByLoginSchema = z.object({
  login: z.string({ message: 'Логин не предоставлен' }),
})

export const GetAccountByEmailSchema = z.object({
  email: z.string({ message: 'Email не предоставлен' }),
})

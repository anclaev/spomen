import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const SendConfirmEmailSchema = z.object({
  account_id: z
    .string({ message: 'ID аккаунта обязателен' })
    .uuid({ message: 'Некорректный ID аккаунта' }),
  email: z
    .string({ message: 'Почта обязательна' })
    .email({ message: 'Некорректная почта' }),
  username: z.string({ message: 'Логин обязателен' }),
})

export type SendConfirmEmailType = z.infer<typeof SendConfirmEmailSchema>
export class SendConfirmEmailDto extends createZodDto(SendConfirmEmailSchema) {}

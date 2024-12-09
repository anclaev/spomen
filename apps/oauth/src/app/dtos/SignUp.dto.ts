import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { SIGN_UP_STATUS } from '../../infrastructure/Enums'

import { IAccount } from '../../domain/Account'

const SignUpSchema = z.object({
  username: z
    .string({ message: 'Логин обязателен' })
    .min(4, { message: 'Логин не может быть менее 4 символов' }),
  email: z
    .string({ message: 'Почта обязательна' })
    .email({ message: 'Почта некорректна' }),
  password: z
    .string({ message: 'Пароль обязателен' })
    .min(8, 'Пароль не может быть менее 8 символов'),
})

export type SignUpDtoType = z.infer<typeof SignUpSchema>
export class SignUpDto extends createZodDto(SignUpSchema) {}

export type SignUpResult = {
  account?: IAccount
  status: SIGN_UP_STATUS
}

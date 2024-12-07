import { defaultConfigSchema } from '@spomen/core'
import { z } from 'zod'

const PORT_INVALID = 'Некорректный порт'
const EXPIRATION_INVALID = 'Некорректное время жизни'

export const schema = defaultConfigSchema.extend({
  DATABASE_URL: z.string({
    message: 'Строка подключения к базе данных не установлена',
  }),
  GRPC_PORT: z
    .string({ message: 'Порт gRPC не установлен' })
    .regex(/^\d+$/, { message: `${PORT_INVALID} gRPC` })
    .min(4, { message: `${PORT_INVALID} gRPC` })
    .max(5, { message: `${PORT_INVALID} gRPC` })
    .transform(Number),
  RESET_TOKEN_SECRET: z.string({
    message: 'Секрет токена восстановления не установлен',
  }),
  RESET_TOKEN_EXPIRATION: z
    .string({
      message: 'Время жизни токена восстановления не установлено',
    })
    .regex(/^\d+$/, {
      message: `${EXPIRATION_INVALID}, токена восстановления пароля`,
    })
    .transform(Number),
  CONFIRMATION_TOKEN_SECRET: z.string({
    message: 'Секрет токена подтверждения не установлен',
  }),
  CONFIRMATION_TOKEN_EXPIRATION: z
    .string({
      message: 'Время жизни токена подтверждения не установлено',
    })
    .regex(/^\d+$/, {
      message: `${EXPIRATION_INVALID}, токена подтверждения почты`,
    })
    .transform(Number),
  REFRESH_TOKEN_SECRET: z.string({
    message: 'Секрет токена обновления не установлен',
  }),
  REFRESH_TOKEN_EXPIRATION: z
    .string({
      message: 'Время жизни токена обновления не установлено',
    })
    .regex(/^\d+$/, {
      message: `${EXPIRATION_INVALID}, токена обновления`,
    })
    .transform(Number),
  COOKIE_SECRET: z.string({ message: 'Секрет куки не установлен' }),
  EMAIL_HOST: z.string({ message: 'Хост сервера почты не установлен' }),
  EMAIL_PORT: z
    .string({ message: 'Порт сервера почты не установлен' })
    .regex(/^\d+$/, { message: `${PORT_INVALID} сервера почты` })
    .min(3, { message: `${PORT_INVALID} сервера почты` })
    .max(5, { message: `${PORT_INVALID} сервера почты` })
    .transform(Number),
  EMAIL_SECURE: z
    .enum(['false', 'true'])
    .default('false')
    .transform((v) => v === 'true'),
  EMAIL_USER: z.string({ message: 'Пользователь сервера почты не установлен' }),
  EMAIL_PASSWORD: z.string({ message: 'Пароль сервера почты не установлен' }),
  ACCESS_TOKEN_EXPIRATION: z
    .string({
      message: 'Время жизни токена доступа не установлено',
    })
    .regex(/^\d+$/, {
      message: `${EXPIRATION_INVALID}, токена доступа`,
    })
    .transform(Number),
  ACCESS_PRIVATE_KEY: z.string().optional(),
  ACCESS_PUBLIC_KEY: z.string().optional(),
})

export type ENV = z.infer<typeof schema>

export const ISSUER = 'Spomen SSO'

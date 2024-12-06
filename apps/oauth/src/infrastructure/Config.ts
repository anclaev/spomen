import { defaultConfigSchema } from '@spomen/core'
import { z } from 'zod'

export const schema = defaultConfigSchema.extend({
  DATABASE_URL: z.string({
    message: 'Строка подключения к базе данных не установлена',
  }),
  GRPC_PORT: z.string({ message: 'Порт gRPC не установлен' }).min(4).max(5),
  RESET_PASSWORD_TOKEN_SECRET: z.string({
    message: 'Секрет токена восстановления пароля не установлен',
  }),
  RESET_PASSWORD_TOKEN_EXPIRATION: z.string({
    message: 'Время жизни токена восстановления пароля не установлено',
  }),
  CONFIRMATION_EMAIL_TOKEN_SECRET: z.string({
    message: 'Секрет токена подтверждения почты не установлен',
  }),
  CONFIRMATION_EMAIL_TOKEN_EXPIRATION: z.string({
    message: 'Время жизни токена подтверждения почты не установлено',
  }),
  REFRESH_TOKEN_SECRET: z.string({
    message: 'Секрет токена обновления не установлен',
  }),
  REFRESH_TOKEN_EXPIRATION: z.string({
    message: 'Время жизни токена обновления не установлено',
  }),
  COOKIE_SECRET: z.string({ message: 'Секрет куки не установлен' }),
  EMAIL_HOST: z.string({ message: 'Хост сервера почты не установлен' }),
  EMAIL_PORT: z.string({ message: 'Порт сервера почты не установлен' }),
  EMAIL_SECURE: z.boolean().default(false),
  EMAIL_USER: z.string({ message: 'Пользователь сервера почты не установлен' }),
  EMAIL_PASSWORD: z.string({ message: 'Пароль сервера почты не установлен' }),
})

export type ENV = z.infer<typeof schema>

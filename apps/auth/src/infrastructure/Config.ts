import { defaultConfigSchema } from '@spomen/core'
import { z } from 'zod'

export const schema = defaultConfigSchema.extend({
  GRPC_PORT: z.string({ message: 'Порт gRPC не установлен' }).min(4).max(5),
  ACCOUNT_GRPC_URL: z.string({
    message: 'Эндпойнт gRRC-сервера Account не установлен',
  }),
  ACCESS_TOKEN_SECRET: z.string({
    message: 'Секрет access-токена не установлен',
  }),
  REFRESH_TOKEN_SECRET: z.string({
    message: 'Секрет refresh-токена не установлен',
  }),
  ACCESS_TOKEN_EXPIRATION: z.string({
    message: 'Время жизни access-токена не установлено',
  }),
  REFRESH_TOKEN_EXPIRATION: z.string({
    message: 'Время жизни refresh-токена не установлено',
  }),
})

export type ENV = z.infer<typeof schema>

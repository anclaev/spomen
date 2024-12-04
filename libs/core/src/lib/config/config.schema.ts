import { z } from 'zod'

export const defaultConfigSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'staging', 'local', 'test'], {
    message: 'Окружение не установлено',
  }),
  HOST: z.string({ message: 'Хост сервиса не установлен' }).min(1),
  PORT: z.string({ message: 'Порт сервиса не установлен' }).min(4).max(5),
})

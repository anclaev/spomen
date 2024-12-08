import { z } from 'zod'

const PORT_ERROR_NOT_SET = 'Порт сервиса не установлен'
const PORT_ERROR_INVALID = 'Некорректный порт сервиса'

export const defaultConfigSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'staging', 'local', 'test'], {
    message: 'Окружение не установлено',
  }),
  DOMAIN: z.string({ message: 'Домен сервиса не установлен' }),
  HOST: z.string({ message: 'Хост сервиса не установлен' }),
  PORT: z
    .string({ message: PORT_ERROR_NOT_SET })
    .regex(/^\d+$/, { message: PORT_ERROR_INVALID })
    .min(4, { message: PORT_ERROR_INVALID })
    .max(5, { message: PORT_ERROR_INVALID })
    .transform(Number),
})

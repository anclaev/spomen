import { defaultConfigSchema } from '@spomen/core'
import { z } from 'zod'

export const schema = defaultConfigSchema.extend({
  // KAFKA_HOST: z.string({ message: 'Хост Kafka не установлен' }).min(1),
  // KAFKA_PORT: z.number({ message: 'Порт Kafka не установлен' }).min(4).max(5),
})

export type ENV = z.infer<typeof schema>

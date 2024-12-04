import { defaultConfigSchema } from '@spomen/core'
import { z } from 'zod'

export const schema = defaultConfigSchema.extend({
  GRPC_PORT: z.string({ message: 'Порт gRPC не установлен' }).min(4).max(5),
})

export type ENV = z.infer<typeof schema>

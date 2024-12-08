import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const ClientIdQuerySchema = z.object({
  client_id: z
    .string({ message: 'ID клиента обязателен' })
    .uuid({ message: 'Некорректный ID клиента' }),
})

export type ClientIdQueryDtoType = z.infer<typeof ClientIdQuerySchema>
export class ClientIdQueryDto extends createZodDto(ClientIdQuerySchema) {}

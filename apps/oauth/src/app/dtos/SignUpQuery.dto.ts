import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const SignUpQuerySchema = z.object({
  client_id: z
    .string({ message: 'client_id required' })
    .uuid({ message: 'client_id invalid' }),
  client_secret: z.string({ message: 'client_secret required' }),
})

export type SignUpQueryDtoType = z.infer<typeof SignUpQuerySchema>
export class SignUpQueryDto extends createZodDto(SignUpQuerySchema) {}

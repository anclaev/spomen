import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const OAuthLoginQuerySchema = z.object({
  response_type: z.string({ message: 'response_type required' }),
  client_id: z
    .string({ message: 'client_id required' })
    .uuid({ message: 'client_id invalid' }),
  client_secret: z.string({ message: 'client_secret required' }),
  redirect_uri: z
    .string({ message: 'redirect_uri required' })
    .url({ message: 'redirect_uri invalid' }),
  scope: z.string({ message: 'scope required' }),
  state: z.string({ message: 'state required' }),
})

export type OAuthLoginQueryType = z.infer<typeof OAuthLoginQuerySchema>
export class OAuthLoginQueryDto extends createZodDto(OAuthLoginQuerySchema) {}

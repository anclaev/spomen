import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const OAuthTokenQuerySchema = z.object({
  grant_type: z.string({ message: 'grant_type required' }),
  code: z.string({ message: 'code required' }),
  redirect_uri: z.string({ message: 'redirect_uri required' }),
  client_id: z.string({ message: 'client_id required' }),
  client_secret: z.string({ message: 'client_secret required' }),
})

export type OAuthTokenQueryType = z.infer<typeof OAuthTokenQuerySchema>
export class OAuthTokenQueryDto extends createZodDto(OAuthTokenQuerySchema) {}

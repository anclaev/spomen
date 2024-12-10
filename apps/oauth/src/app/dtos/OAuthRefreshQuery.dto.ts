import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const OAuthRefreshQuerySchema = z.object({
  grant_type: z.string({ message: 'grant_type required' }),
  refresh_token: z.string({ message: 'refresh_token required' }),
  client_id: z.string({ message: 'client_id required' }),
  client_secret: z.string({ message: 'client_secret required' }),
})

export type OAuthRefreshQueryType = z.infer<typeof OAuthRefreshQuerySchema>
export class OAuthRefreshQueryDto extends createZodDto(
  OAuthRefreshQuerySchema
) {}

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const OAuthAuthorizeQuerySchema = z.object({
  client_id: z.string({ message: 'client_id required' }),
  client_secret: z.string({ message: 'client_secret required' }),
  redirect_uri: z.string({ message: 'redirect_uri required' }),
  scope: z.string({ message: 'scope required' }),
  state: z.string({ message: 'state required' }),
})

export type OAuthAuthorizeQueryType = z.infer<typeof OAuthAuthorizeQuerySchema>
export class OAuthAuthorizeQueryDto extends createZodDto(
  OAuthAuthorizeQuerySchema
) {}

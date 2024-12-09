import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const OAuthTokenResponeSchema = z.object({
  access_token: z.any(),
  refresh_token: z.any(),
  token_type: z.any(),
  user: z.object({
    id: z.any(),
    version: z.any(),
    username: z.any(),
    email: z.any(),
    roles: z.any(),
    status: z.any(),
    meta: z.any(),
    created_at: z.any(),
    updated_at: z.any(),
  }),
})

export class OAuthTokenResponseDto extends createZodDto(
  OAuthTokenResponeSchema
) {}

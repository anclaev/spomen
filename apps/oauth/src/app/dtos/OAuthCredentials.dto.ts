import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const OAuthCredentialsSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string(),
})

export type OAuthCredentialsType = z.infer<typeof OAuthCredentialsSchema>
export class OAuthCredentialsDto extends createZodDto(OAuthCredentialsSchema) {}

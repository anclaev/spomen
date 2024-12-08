import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const AccountSchema = z.object({
  id: z.any(),
  version: z.any(),
  username: z.any(),
  email: z.any(),
  status: z.any(),
  roles: z.any(),
  meta: z.any(),
  created_at: z.any(),
  updated_at: z.any(),
  sessions: z.any().optional(),
})

export class AccountDto extends createZodDto(AccountSchema) {}

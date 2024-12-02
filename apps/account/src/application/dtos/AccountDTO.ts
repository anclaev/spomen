import { createZodDto } from 'nestjs-zod'
import { any, z } from 'zod'

const AccountSchema = z.object({
  id: any(),
  login: any(),
  email: any(),
  status: any(),
  roles: any(),
  meta: any(),
  first_name: any(),
  last_name: any(),
  birthday: any(),
  sex: any(),
  created_at: any(),
  sessions: any().optional(),
})

export class AccountDTO extends createZodDto(AccountSchema) {}

import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const createAccountSchema = z.object({
  login: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  birthday: z.date().optional(),
  sex: z.number().min(0).max(2).optional(),
})

export type CreateAccountDTO = {
  login?: string
  email: string
  password: string
  first_name?: string
  last_name?: string
  birthday?: Date
  sex?: 0 | 1 | 2
}

export class CreateAccountZodDTO extends createZodDto(createAccountSchema) {}

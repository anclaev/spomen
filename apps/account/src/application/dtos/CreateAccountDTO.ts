import { createZodDto } from 'nestjs-zod'

import { CreateAccountSchema } from '@spomen/core'

export type CreateAccountDTO = {
  login?: string
  email: string
  password: string
  first_name?: string
  last_name?: string
  birthday?: string
  sex?: 0 | 1 | 2
}

export class CreateAccountZodDTO extends createZodDto(CreateAccountSchema) {}

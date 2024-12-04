import { Body, Controller, Post } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { CommandBus } from '@nestjs/cqrs'

import { CreateAccountCommand } from '../application/commands/CreateAccountCommand'
import { AccountDTO } from '../application/dtos/AccountDTO'

import {
  CreateAccountDTO,
  CreateAccountZodDTO,
} from '../application/dtos/CreateAccountDTO'

@Controller('account')
export class AccountController {
  constructor(readonly commandBus: CommandBus) {}

  @ZodSerializerDto(AccountDTO)
  @Post()
  async createAccount(@Body() dto: CreateAccountZodDTO): Promise<AccountDTO> {
    return await this.commandBus.execute(
      new CreateAccountCommand(dto as CreateAccountDTO)
    )
  }
}

import { ICommand } from '@nestjs/cqrs'

import { CreateAccountDTO } from '../dtos/CreateAccountDTO'

export class CreateAccountCommand implements ICommand {
  constructor(readonly dto: CreateAccountDTO) {}
}

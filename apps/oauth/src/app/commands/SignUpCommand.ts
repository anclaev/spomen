import { ICommand } from '@nestjs/cqrs'

import { ClientIdQueryDtoType } from '../dtos/ClientIdQuery.dto'
import { SignUpDtoType } from '../dtos/SignUp.dto'

export class SignUpCommand implements ICommand {
  constructor(readonly dto: SignUpDtoType & ClientIdQueryDtoType) {}
}

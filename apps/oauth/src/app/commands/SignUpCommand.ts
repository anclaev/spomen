import { ICommand } from '@nestjs/cqrs'

import { SignUpQueryDtoType } from '../dtos/SignUpQuery.dto'
import { SignUpDtoType } from '../dtos/SignUp.dto'

export class SignUpCommand implements ICommand {
  constructor(readonly dto: SignUpDtoType & SignUpQueryDtoType) {}
}

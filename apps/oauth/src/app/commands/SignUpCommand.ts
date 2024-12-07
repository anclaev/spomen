import { ICommand } from '@nestjs/cqrs'

import { SignUpDto } from '../dtos/SignUp.dto'

export class SignUpCommand implements ICommand {
  constructor(readonly dto: SignUpDto) {}
}

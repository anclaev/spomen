import { AccountCredentials } from '@spomen/core'
import { ICommand } from '@nestjs/cqrs'

export class CreateTokenCommand implements ICommand {
  constructor(readonly payload: AccountCredentials) {}
}

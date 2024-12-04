import { LoginWithPasskeyPayload } from '@spomen/core'
import { ICommand } from '@nestjs/cqrs'

export class LoginWithPasskeyCommand implements ICommand {
  constructor(readonly payload: LoginWithPasskeyPayload) {}
}

import { LoginWithPasswordPayload } from '@spomen/core'
import { ICommand } from '@nestjs/cqrs'

export class LoginWithPasswordCommand implements ICommand {
  constructor(readonly payload: LoginWithPasswordPayload) {}
}

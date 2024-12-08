import { IEvent } from '@nestjs/cqrs'

import { IAccount } from '../Account'

export class AccountRegisteredEvent implements IEvent {
  constructor(
    readonly client_id: string,
    readonly account: IAccount
  ) {}
}

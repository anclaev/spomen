import { IEvent } from '@nestjs/cqrs'

export class AccountRegisteredEvent implements IEvent {
  constructor(readonly accountId: string) {}
}

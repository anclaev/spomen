import { IEvent } from '@nestjs/cqrs'

export class AccountCreatedEvent implements IEvent {
  constructor(readonly accountId: string) {}
}

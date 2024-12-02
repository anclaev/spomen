import { IEvent } from '@nestjs/cqrs'

export class AccountRemovedEvent implements IEvent {
  constructor(readonly accountId: string) {}
}

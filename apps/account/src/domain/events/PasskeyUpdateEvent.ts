import { IEvent } from '@nestjs/cqrs'

export class PasskeyUpdatedEvent implements IEvent {
  constructor(readonly accountId: string) {}
}

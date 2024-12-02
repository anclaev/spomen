import { EventsHandler, IEventHandler } from '@nestjs/cqrs'

import { AccountCreatedEvent } from '../../domain/events/AccountCreatedEvent'

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedHandler
  implements IEventHandler<AccountCreatedEvent>
{
  handle(event: AccountCreatedEvent): void {
    // Logger.log(`account created with ID: ${event.accountId}`)
  }
}

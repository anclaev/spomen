import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Logger } from '@nestjs/common'

import { AccountRegisteredEvent } from '../../domain/events/AccountRegisteredEvent'

@EventsHandler(AccountRegisteredEvent)
export class AccountRegisteredHandler
  implements IEventHandler<AccountRegisteredEvent>
{
  handle(event: AccountRegisteredEvent): void {
    Logger.log(`Account registered with ID: ${event.accountId}`)
  }
}

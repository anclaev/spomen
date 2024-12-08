import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { Inject, Logger } from '@nestjs/common'

import { AccountRepository } from '../../infrastructure/repository/account.repository'
import { EmailService } from '../../infrastructure/email/email.service'

import { AccountRegisteredEvent } from '../../domain/events/AccountRegisteredEvent'

import { InjectionToken } from '../injection-token'

@EventsHandler(AccountRegisteredEvent)
export class AccountRegisteredHandler
  implements IEventHandler<AccountRegisteredEvent>
{
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly account: AccountRepository,
    @Inject(InjectionToken.EMAIL_SERVICE) private readonly email: EmailService
  ) {}

  async handle({ client_id, account }: AccountRegisteredEvent): Promise<void> {
    const confirmationEmailIsSended = await this.email.sendConfirmationEmail(
      {
        email: account.getEmail(),
        account_id: account.getId(),
        username: account.getUsername(),
        client_id,
      },
      account
    )

    if (confirmationEmailIsSended instanceof Error) {
      Logger.error(confirmationEmailIsSended)
    } else {
      account.changeStatus('PENDING')

      await this.account.update(account.getId(), account)
    }

    await Logger.log(
      `Аккаунт зарегистрирован: ${account.getUsername()} (${account.getEmail()})`
    )
  }
}

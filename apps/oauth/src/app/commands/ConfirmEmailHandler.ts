import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JsonWebTokenError } from '@nestjs/jwt'
import { Inject, Logger } from '@nestjs/common'

import { AccountRepository } from '../../infrastructure/repository/account.repository'
import { CONFIRM_EMAIL_STATUS, TOKEN_TYPES } from '../../infrastructure/Enums'
import { TokenService } from '../../infrastructure/token/token.service'
import { IConfirmToken } from '../../infrastructure/token/Tokens'

import { ConfirmEmailCommand } from './ConfirmEmailCommand'

import { InjectionToken } from '../injection-token'

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailHandler
  implements ICommandHandler<ConfirmEmailCommand>
{
  constructor(
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly account: AccountRepository,
    @Inject(InjectionToken.TOKEN_SERVICE) private readonly token: TokenService
  ) {}

  async execute({ dto }: ConfirmEmailCommand): Promise<CONFIRM_EMAIL_STATUS> {
    try {
      const validatedToken = await this.token.verifyToken<IConfirmToken>(
        dto.token,
        TOKEN_TYPES.CONFIRMATION
      )

      if (!validatedToken || !validatedToken.account_id) {
        return CONFIRM_EMAIL_STATUS.INVALID
      }

      const account = await this.account.findById(validatedToken.account_id)

      if (!account) {
        return CONFIRM_EMAIL_STATUS.INVALID
      }

      if (account.getStatus() !== 'PENDING') {
        return CONFIRM_EMAIL_STATUS.ALREADY_CONFIRMED
      }

      account.confirm()
      account.commit()

      await this.account.update(validatedToken.account_id, account)

      await Logger.log(
        `Аккаунт подтверждён: ${account.getUsername()} (${account.getEmail()})`
      )

      return CONFIRM_EMAIL_STATUS.SUCCESS
    } catch (e: unknown) {
      console.log(e)
      if (e instanceof JsonWebTokenError && e.name === 'TokenExpiredError') {
        return CONFIRM_EMAIL_STATUS.EXPIRED
      }
      return CONFIRM_EMAIL_STATUS.INVALID
    }
  }
}
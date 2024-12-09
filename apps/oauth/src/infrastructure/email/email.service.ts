import { ConfigService, MailerService } from '@spomen/core'
import { Inject, Injectable, Logger } from '@nestjs/common'

import { AccountRepository } from '../repository/account.repository'
import { TokenService } from '../token/token.service'

import { IConfirmationTemplateArgs, ITemplates } from '../Templates'
import { TEMPLATES, TOKEN_TYPES } from '../Enums'
import { ENV } from '../Config'

import { SendConfirmEmailType } from '../../app/dtos/SendConfirmEmail.dto'
import { ClientIdQueryDtoType } from '../../app/dtos/ClientIdQuery.dto'

import { IAccount } from '../../domain/Account'

import { InjectionToken } from '../../app/injection-token'

@Injectable()
export class EmailService {
  private templates: ITemplates = {
    confirmation: null,
  }

  constructor(
    private readonly config: ConfigService,
    @Inject(InjectionToken.MAILER_SERVICE)
    private readonly mailer: MailerService,
    @Inject(InjectionToken.TOKEN_SERVICE)
    private readonly token: TokenService,
    @Inject(InjectionToken.ACCOUNT_REPOSITORY)
    private readonly account: AccountRepository
  ) {
    const confirmEmailTemplate =
      this.mailer.parseTemplate<IConfirmationTemplateArgs>(
        TEMPLATES.CONFIRM_EMAIL
      )

    if (confirmEmailTemplate instanceof Error) {
      Logger.error(`Ошибка парсинга шаблона: ${TEMPLATES.CONFIRM_EMAIL}.hbs`)
      process.exit(1)
    }

    this.templates.confirmation = confirmEmailTemplate
  }

  async sendConfirmationEmail(
    dto: SendConfirmEmailType & ClientIdQueryDtoType,
    alreadyAccount?: IAccount
  ): Promise<boolean | Error> {
    const account =
      alreadyAccount || (await this.account.findById(dto.account_id))

    if (
      !account ||
      (account.getStatus() !== 'CREATED' && account.getStatus() !== 'PENDING')
    ) {
      return new Error('Аккаунт уже подтвержден')
    }

    const token = await this.token.generateToken(
      {
        version: account.getVersion(),
        user: {
          email: dto.email,
          username: dto.username,
          id: dto.account_id,
        },
      },
      TOKEN_TYPES.CONFIRMATION
    )

    const html = this.templates.confirmation({
      username: dto.username,
      link: `${this.config.isProduction ? 'https' : 'http'}://${this.config.env<ENV>('DOMAIN')}/oauth/confirm/${token}`,
    })

    const result = await this.mailer.sendEmail(
      this.config.isProduction ? dto.email : this.config.env<ENV>('TEST_EMAIL'),
      `Добро пожаловать, ${dto.username}`,
      html
    )

    if (result instanceof Error) {
      Logger.error(result)
      return result
    }

    return true
  }
}

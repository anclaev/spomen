import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { createTransport, Transporter } from 'nodemailer'
import { Injectable } from '@nestjs/common'
import Handlebars from 'handlebars'
import { readFileSync } from 'fs'
import { join } from 'path'

import { ConfigService } from '../config'

@Injectable()
export class MailerService {
  private readonly transport: Transporter<SMTPTransport.SentMessageInfo>
  private readonly domain: string
  private readonly email: string

  constructor(private readonly config: ConfigService) {
    this.transport = createTransport({
      host: config.get<string>('EMAIL_HOST'),
      port: Number(config.get<string>('EMAIL_PORT')),
      secure: Boolean(config.get<string>('EMAIL_SECURE')),
      auth: {
        user: config.get<string>('EMAIL_USER'),
        pass: config.get<string>('EMAIL_PASSWORD'),
      },
    })
    this.email = `Spomen <${config.get<string>('EMAIL_USER')}>`
    this.domain = config.get<string>('DOMAIN')
  }

  /**
   * Функция парсинга шаблона
   * @description Принимает интерфейс параметров шаблона и возвращает скомпилированный шаблон Handlebars (либо ошибку)
   * @param templateName Имя шаблона
   * @private
   */
  public parseTemplate<T extends object>(
    templateName: string
  ): Handlebars.TemplateDelegate<T> | Error {
    try {
      const templateText = readFileSync(
        join(__dirname, 'templates', templateName, `${templateName}.hbs`),
        'utf-8'
      )

      return Handlebars.compile<T>(templateText, { strict: true })
    } catch (e) {
      return e
    }
  }

  /**
   * Отправка письма
   * Возвращает true при успешной отправке либо ошибку, если таковая возникнет
   * @param to Почта получателя
   * @param subject Тема письма
   * @param html Текст письма в формате html
   */
  public async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<boolean | Error> {
    return await this.transport
      .sendMail({
        from: this.email,
        to,
        subject,
        html,
      })
      .then(() => {
        return true
      })
      .catch((e) => {
        return new Error(`Ошибка отправки письма подтверждения аккаунта: ${to}`)
      })
  }
}

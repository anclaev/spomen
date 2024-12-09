import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'

import {
  ConfigModule,
  MailerService,
  PrismaProvider,
  SERVICES,
} from '@spomen/core'

import { OAuthClientRepository } from '../infrastructure/repository/OAuthClient.repository'
import { AccountRepository } from '../infrastructure/repository/account.repository'
import { SessionRepository } from '../infrastructure/repository/session.repository'
import { OAuth2Module } from '../infrastructure/oauth2/OAuth2.module'
import { TokenService } from '../infrastructure/token/token.service'
import { EmailService } from '../infrastructure/email/email.service'
import { schema } from '../infrastructure/Config'

import { AccountFactory } from '../domain/AccountFactory'
import { OAuthClientFactory } from '../domain/OAuthClientFactory'

import { ConfirmEmailHandler } from './commands/ConfirmEmailHandler'
import { SignUpHandler } from './commands/SignUpHandler'

import { AccountRegisteredHandler } from './events/AccountRegisteredHandler'

import { InjectionToken } from './injection-token'

const infrastructure: Provider[] = [
  {
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  },
  { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  {
    provide: InjectionToken.PRISMA_PROVIDER,
    useClass: PrismaProvider,
  },
  {
    provide: InjectionToken.OAUTH_CLIENT_REPOSITORY,
    useClass: OAuthClientRepository,
  },
  {
    provide: InjectionToken.ACCOUNT_REPOSITORY,
    useClass: AccountRepository,
  },
  {
    provide: InjectionToken.SESSION_REPOSITORY,
    useClass: SessionRepository,
  },
  {
    provide: InjectionToken.TOKEN_SERVICE,
    useClass: TokenService,
  },
  {
    provide: InjectionToken.MAILER_SERVICE,
    useClass: MailerService,
  },
  {
    provide: InjectionToken.EMAIL_SERVICE,
    useClass: EmailService,
  },
]

const domain = [AccountFactory, OAuthClientFactory]

const app = [SignUpHandler, AccountRegisteredHandler, ConfirmEmailHandler]

@Module({
  imports: [
    ConfigModule.register({
      schema,
      service: SERVICES.OAUTH,
    }),
    CqrsModule,
    JwtModule.register({
      global: true,
    }),
    OAuth2Module,
  ],
  providers: [...infrastructure, ...domain, ...app],
})
export class AppModule {}

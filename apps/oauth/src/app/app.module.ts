import {
  ConfigModule,
  MailerService,
  PrismaProvider,
  SERVICES,
} from '@spomen/core'

import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { OAuth2ServerModule } from '@boyuai/nestjs-oauth2-server'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'

import { OAuthClientRepository } from '../infrastructure/repository/OAuthClient.repository'
import { AccountRepository } from '../infrastructure/repository/account.repository'
import { SessionRepository } from '../infrastructure/repository/session.repository'
import { OAuth2Service } from '../infrastructure/oauth2/OAuth2.service'
import { OAuth2Module } from '../infrastructure/oauth2/OAuth2.module'
import { TokenService } from '../infrastructure/token/token.service'
import { EmailService } from '../infrastructure/email/email.service'
import { schema } from '../infrastructure/Config'

import { OAuthClientFactory } from '../domain/OAuthClientFactory'
import { AccountFactory } from '../domain/AccountFactory'

import { AccountRegisteredHandler } from './events/AccountRegisteredHandler'
import { ConfirmEmailHandler } from './commands/ConfirmEmailHandler'
import { SignUpHandler } from './commands/SignUpHandler'

import { InjectionToken } from './injection-token'

import { OAuthController } from '../api/oauth.controller'

const infrastructure: Provider[] = [
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
  {
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  },
  { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
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
    OAuth2ServerModule.forRoot({
      imports: [OAuth2Module],
      modelClass: OAuth2Service,
    }),
  ],
  providers: [...infrastructure, ...domain, ...app],
  controllers: [OAuthController],
})
export class AppModule {}

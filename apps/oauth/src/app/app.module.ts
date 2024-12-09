import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
  RequestMethod,
} from '@nestjs/common'

import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'

import {
  ConfigModule,
  MailerService,
  PrismaProvider,
  SERVICES,
} from '@spomen/core'

import { OAuthClientRepository } from '../infrastructure/oauth/OAuthClient.repository'
import { AccountRepository } from '../infrastructure/repository/account.repository'
import { SessionRepository } from '../infrastructure/repository/session.repository'
import { OAuthMiddleware } from '../infrastructure/oauth/OAuth.middleware'
import { OAuthService } from '../infrastructure/oauth/OAuth.service'
import { TokenService } from '../infrastructure/token/token.service'
import { EmailService } from '../infrastructure/email/email.service'
import { ClientGuard } from '../infrastructure/guard/client.guard'
import { AuthService } from '../infrastructure/auth/auth.service'
import { schema } from '../infrastructure/Config'

import { OAuthClientFactory } from '../domain/OAuthClientFactory'
import { AccountFactory } from '../domain/AccountFactory'
import { SessionFactory } from '../domain/SessionFactory'

import { ConfirmEmailHandler } from './commands/ConfirmEmailHandler'
import { SignUpHandler } from './commands/SignUpHandler'

import { AccountRegisteredHandler } from './events/AccountRegisteredHandler'

import { OAuthController } from '../api/OAuth.controller'

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
  {
    provide: InjectionToken.AUTH_SERVICE,
    useClass: AuthService,
  },
  {
    provide: InjectionToken.OAUTH_SERVICE,
    useClass: OAuthService,
  },
  ClientGuard,
]

const domain = [SessionFactory, AccountFactory, OAuthClientFactory]

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
  ],
  providers: [...infrastructure, ...domain, ...app],
  controllers: [OAuthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OAuthMiddleware).forRoutes(
      { path: '/oauth/authorize', method: RequestMethod.GET },
      {
        path: '/oauth/authorize',
        method: RequestMethod.POST,
      }
    )
  }
}

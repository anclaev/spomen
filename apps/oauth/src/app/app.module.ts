import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { ConfigModule, PrismaProvider, SERVICES } from '@spomen/core'
import { OAuth2ServerModule } from '@boyuai/nestjs-oauth2-server'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'

import { AccountRepository } from '../infrastructure/repository/account.repository'
import { SessionRepository } from '../infrastructure/repository/session.repository'
import { OAuth2Service } from '../infrastructure/oauth2/OAuth2.service'
import { OAuth2Module } from '../infrastructure/oauth2/OAuth2.module'

import { InjectionToken } from './injection-token'
import { schema } from '../infrastructure/Config'

import { AuthFactory } from '../domain/AuthFactory'

import { OAuthController } from '../api/oauth.controller'

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.PRISMA_PROVIDER,
    useClass: PrismaProvider,
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
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  },
  { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
]

const domain = [AuthFactory]

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
  providers: [...infrastructure, ...domain],
  controllers: [OAuthController],
})
export class AppModule {}

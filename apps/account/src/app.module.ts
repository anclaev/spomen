import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { ConfigModule, PrismaProvider, SERVICES } from '@spomen/core'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { AccountRepository } from './infrastructure/AccountRepository'
import { schema } from './infrastructure/Config'

import { AccountByEmailHandler } from './application/queries/AccountByEmailHandler'
import { AccountByLoginHandler } from './application/queries/AccountByLoginHandler'

import { CreateAccountHandler } from './application/commands/CreateAccountHandler'
import { AccountCreatedHandler } from './application/events/AccountCreatedHandler'
import { InjectionToken } from './application/injection-token'

import { AccountFactory } from './domain/AccountFactory'

import { GrpcAccountController } from './api/grpc-account.controller'
import { AccountController } from './api/account.controller'

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
    provide: APP_PIPE,
    useClass: ZodValidationPipe,
  },
  { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
]

const application = [
  CreateAccountHandler,
  AccountCreatedHandler,
  AccountByEmailHandler,
  AccountByLoginHandler,
]
const domain = [AccountFactory]

@Module({
  imports: [
    ConfigModule.register({
      schema,
      service: SERVICES.ACCOUNT,
    }),
    CqrsModule,
  ],
  controllers: [GrpcAccountController, AccountController],
  providers: [...infrastructure, ...application, ...domain],
})
export class AppModule {}

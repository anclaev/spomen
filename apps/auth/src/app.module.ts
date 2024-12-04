import {
  ConfigModule,
  ConfigService,
  PrismaProvider,
  SERVICES,
} from '@spomen/core'

import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Module, Provider } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { join } from 'path'

import { AuthRepository } from './infrastructure/AuthRepository'
import { ENV, schema } from './infrastructure/Config'

import { LoginWithPasswordHandler } from './application/commands/LoginWithPasswordHandler'
import { LoginWithPasskeyHandler } from './application/commands/LoginWithPasskeyHandler'
import { CreateTokenHandler } from './application/commands/CreateTokenHandler'
import { InjectionToken } from './application/injection-token'

import { AuthFactory } from './domain/AuthFactory'

import { GrpcAuthController } from './api/grpc-auth.controller'

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.PRISMA_PROVIDER,
    useClass: PrismaProvider,
  },
  {
    provide: InjectionToken.AUTH_REPOSITORY,
    useClass: AuthRepository,
  },
]

const application: Provider[] = [
  CreateTokenHandler,
  LoginWithPasskeyHandler,
  LoginWithPasswordHandler,
]
const domain: Provider[] = [AuthFactory]

const services: Provider[] = [
  {
    provide: InjectionToken.ACCOUNT_SERVICE,
    useFactory: (config: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: 'account',
          protoPath: join(__dirname, 'protos/account.proto'),
          loader: { keepCase: true },
          url: config.env<ENV>('ACCOUNT_GRPC_URL'),
        },
      })
    },
    inject: [ConfigService],
  },
]

@Module({
  imports: [
    ConfigModule.register({
      schema,
      service: SERVICES.AUTH,
    }),
    CqrsModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [GrpcAuthController],
  providers: [...infrastructure, ...application, ...domain, ...services],
})
export class AppModule {}

import {
  ConfigService,
  createLogger,
  SERVICES,
  withDeployMigrations,
} from '@spomen/core'

import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ReflectionService } from '@grpc/reflection'
import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { join } from 'path'

import { ENV } from './infrastructure/Config'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createLogger(SERVICES.AUTH),
  })

  const config = app.get(ConfigService)
  const host = config.env<ENV>('HOST')
  const http_port = config.env<ENV>('PORT')
  const grpc_port = config.env<ENV>('GRPC_PORT')

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        url: `${host}:${grpc_port}`,
        protoPath: join(__dirname, 'protos/auth/src/auth.proto'),
        loader: { keepCase: true },
        onLoadPackageDefinition: (pkg, server) => {
          new ReflectionService(pkg).addToServer(server)
        },
      },
    },
    { inheritAppConfig: true }
  )

  await app
    .startAllMicroservices()
    .catch((err) => {
      Logger.error(err)
    })
    .finally(() => {
      Logger.log(`Сервис GRPC успешно запущен (${host}:${grpc_port})!`)
    })

  await app
    .listen(config.env<ENV>('PORT'))
    .then(() => Logger.log(`Сервис успешно запущен (${host}:${http_port})!`))
}

if (process.env.DOCKER) {
  withDeployMigrations(bootstrap)
} else {
  bootstrap()
}

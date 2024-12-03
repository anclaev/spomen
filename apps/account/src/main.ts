import {
  ConfigService,
  createLogger,
  PrismaClientExceptionFilter,
  SERVICES,
  withDeployMigrations,
} from '@spomen/core'

import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'

import { ENV } from './infrastructure/Config'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createLogger(SERVICES.ACCOUNT),
  })

  app.enableShutdownHooks()

  const { httpAdapter } = app.get(HttpAdapterHost)

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  const config = app.get(ConfigService)

  await app
    .listen(config.env<ENV>('PORT'))
    .then(() =>
      Logger.log(
        `Сервис успешно запущен (${config.env<ENV>('HOST')}:${config.env<ENV>('PORT')})!`
      )
    )
}

if (process.env.DOCKER) {
  withDeployMigrations(bootstrap)
} else {
  bootstrap()
}

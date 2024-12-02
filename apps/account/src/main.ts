import { ConfigService, createLogger, SERVICES } from '@spomen/core'
import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'

import { AppModule } from './app/app.module'
import { ENV } from './infrastructure/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createLogger(SERVICES.ACCOUNT),
  })

  app.enableShutdownHooks()

  const config = app.get(ConfigService)

  await app
    .listen(config.env<ENV>('PORT'))
    .then(() =>
      Logger.log(
        `Сервис успешно запущен (${config.env<ENV>('HOST')}:${config.env<ENV>('PORT')})!`
      )
    )
}

bootstrap()

import {
  ConfigService,
  createLogger,
  PrismaClientExceptionFilter,
  SERVICES,
} from '@spomen/core'

import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { exec } from 'child_process'

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
  exec('npx prisma migrate deploy', (err, stdout, stderr) => {
    if (err) {
      console.error()
      console.error('Error:')
      console.error(err)
      console.error()
    }
    console.log(stdout)
    console.error(stderr)

    bootstrap()
  })
} else {
  bootstrap()
}

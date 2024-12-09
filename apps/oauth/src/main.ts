import {
  ConfigService,
  createLogger,
  createTracer,
  PrismaClientExceptionFilter,
  SERVICES,
} from '@spomen/core'

import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { Logger } from '@nestjs/common'
import { join } from 'path'

import { loadKeys } from './infrastructure/token/Tokens'
import { ENV } from './infrastructure/Config'

import { AppModule } from './app/app.module'

async function bootstrap() {
  createTracer(SERVICES.OAUTH).start()

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: createLogger(SERVICES.OAUTH),
  })

  const config = app.get(ConfigService)
  const host = config.env<ENV>('HOST')
  const http_port = config.env<ENV>('PORT')

  const keys = loadKeys()

  if (keys instanceof Error) {
    Logger.error(keys.message)
    process.exit(1)
  }

  config.set('ACCESS_PRIVATE_KEY', keys.privateKey)
  config.set('ACCESS_PUBLIC_KEY', keys.publicKey)

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  app.setBaseViewsDir(join(__dirname, 'templates'))
  app.setViewEngine('hbs')

  app.use(cookieParser())

  await app
    .listen(http_port)
    .then(() => Logger.log(`Сервис успешно запущен (${host}:${http_port})!`))
}

bootstrap()

import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { Logger } from 'winston'

import { createConsoleLogger } from '../utils'

@Injectable()
export class PrismaProvider extends PrismaClient implements OnModuleInit {
  logger: Logger

  constructor() {
    super()
    this.logger = createConsoleLogger({ service: 'Prisma', label: 'App' })
  }

  async onModuleInit(): Promise<void> {
    await this.$connect().finally(() => {
      this.logger.log({
        message: 'Подключение к базе данных установлено!',
        level: 'info',
      })
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.$on('error', () => {
      return
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.$on('warn', () => {
      return
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.$on('info', () => {
      return
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.$on('query', () => {
      return
    })
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    process.on('beforeExit', async (event) => {
      this.logger.error(event)
      await app.close()
    })
  }
}

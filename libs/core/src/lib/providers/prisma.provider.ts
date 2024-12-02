import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { Logger } from 'winston'

import { createConsoleLogger } from '../utils'

@Injectable()
export class PrismaProvider extends PrismaClient implements OnModuleInit {
  logger: Logger

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    })

    this.logger = createConsoleLogger({ service: 'Prisma', label: 'App' })
  }

  async onModuleInit(): Promise<void> {
    await this.$connect().finally(() => {
      this.logger.log({
        message: 'Подключение к базе данных установлено!',
        level: 'info',
      })
    })
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    process.on('beforeExit', async (event) => {
      this.logger.error(event)
      await app.close()
    })
  }
}

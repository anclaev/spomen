import { ConfigModule, PrismaProvider, SERVICES } from '@spomen/core'
import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { schema } from '../config'

@Module({
  imports: [
    ConfigModule.register({
      schema,
      service: SERVICES.ACCOUNT,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaProvider],
})
export class AppModule {}

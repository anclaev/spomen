import { ConfigModule, SERVICES } from '@spomen/core'
import { CqrsModule } from '@nestjs/cqrs'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { schema } from '../infrastructure/Config'

@Module({
  imports: [
    ConfigModule.register({
      schema,
      service: SERVICES.OAUTH,
    }),
    CqrsModule,
    JwtModule.register({
      global: true,
    }),
  ],
})
export class AppModule {}

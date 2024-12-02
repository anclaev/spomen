import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule as RootConfigModule } from '@nestjs/config'

import { defaultConfigSchema } from './config.schema'
import { ConfigOptions, ConfigType } from '../types'
import { ConfigService } from './config.service'
import { APP_NAME } from '../constants'
import { validate } from './validator'

@Module({})
export class ConfigModule {
  static register(
    options: ConfigOptions = {
      schema: defaultConfigSchema as ConfigType,
      service: APP_NAME,
    }
  ): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        RootConfigModule.forRoot({
          validate: (env) => validate(env, options),
          cache: true,
          isGlobal: true,
        }),
      ],
      providers: [ConfigService],
      global: true,
    }
  }
}

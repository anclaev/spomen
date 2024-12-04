import { ConfigService as Config } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ConfigService extends Config {
  constructor() {
    super()
  }

  env<T, V = string>(key: keyof T): V | undefined {
    return this.get<V>(key as string)
  }
}

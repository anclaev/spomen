import { ZodObject } from 'zod'

export type ConfigType = ZodObject<any>

export type ConfigOptions = {
  schema?: ConfigType
  service?: string
}

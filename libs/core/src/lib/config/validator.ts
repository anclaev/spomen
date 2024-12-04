import { createConsoleLogger } from '../utils/logger'
import { ConfigOptions } from '../types/config'

export const validate = (
  env: Record<string, unknown>,
  { schema, service }: ConfigOptions
): Record<string, any> => {
  const logger = createConsoleLogger({
    service: service!,
    label: 'Config',
    exitOnError: false,
  })

  const res = schema!.safeParse(env)

  if (!res.success) {
    res.error.errors.map((err) => {
      logger.error(err.message)
    })

    process.exit(1)
  }

  return res.data as Record<string, unknown>
}

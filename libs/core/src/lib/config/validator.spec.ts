import winston, { Logger } from 'winston'
import { z } from 'zod'

import { ConfigType } from '../types/config'
import { validate } from './validator'

import * as logger from '../utils/logger'

describe('validate()', () => {
  const envs = {
    NODE_ENV: 'test',
  }

  const schema = z.object({
    NODE_ENV: z.enum(['production', 'development', 'staging', 'local', 'test']),
  }) as ConfigType

  let loggerMock: winston.Logger

  it('should be validate', () => {
    expect(
      validate(envs, {
        schema,
        service: 'test',
      })
    ).toEqual({ NODE_ENV: 'test' })
  })

  it('should be exit with code 1', () => {
    const mockExit = jest
      .spyOn(process, 'exit')
      .mockImplementation((number) => {
        throw new Error('process.exit: ' + number)
      })

    const mockError = jest
      .spyOn(logger, 'createConsoleLogger')
      .mockImplementation(
        (): Logger =>
          winston.createLogger(
            logger.loggerOptionsFactory({
              service: 'test',
              exitOnError: false,
              label: 'test',
            })
          )
      )

    expect(() =>
      validate(
        {},
        {
          schema,
          service: 'test',
        }
      )
    ).toThrow()

    expect(mockError).toHaveBeenCalled()
    expect(mockExit).toHaveBeenCalledWith(1)
    mockExit.mockRestore()
    mockError.mockRestore()
  })
})

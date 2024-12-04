import winston, { Logger } from 'winston'
import { Test } from '@nestjs/testing'

import { PrismaProvider } from './prisma.provider'
import * as logger from '../utils/logger'

describe('PrismaProvider', () => {
  let prisma: PrismaProvider

  let mockCreateLogger: any
  let mockLogger: winston.Logger

  beforeEach(async () => {
    mockCreateLogger = jest
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

    const moduleRef = await Test.createTestingModule({
      providers: [PrismaProvider],
    }).compile()

    prisma = moduleRef.get(PrismaProvider)
    mockLogger = prisma.logger
  })

  it('should be defined', () => {
    expect(prisma.$connect()).rejects.toBeCalled()
  })
})

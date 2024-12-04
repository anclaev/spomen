import {
  createConsoleLogger,
  createLogger,
  LoggerOptions,
  loggerOptionsFactory,
} from './logger'

const options: LoggerOptions = {
  exitOnError: false,
  label: 'test',
  service: 'test',
}

describe('loggerOptionsFactory()', () => {
  it('should return the logger options', () => {
    expect(loggerOptionsFactory(options)).toBeDefined()
  })
})

describe('createConsoleLogger()', () => {
  it('should create logger service instance (winston)', () => {
    expect(createConsoleLogger(options)).toBeDefined()
  })
})

describe('createLogger()', () => {
  it('should create logger service instance (nest)', () => {
    expect(createLogger('test')).toBeDefined()
  })
})

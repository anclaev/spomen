import { Test } from '@nestjs/testing'

import { ConfigService } from './config.service'
import { ConfigModule } from '@nestjs/config'

describe('ConfigService', () => {
  let service: ConfigService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [ConfigService],
    }).compile()

    service = moduleRef.get(ConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return env', () => {
    expect(service.env<{ NODE_ENV: 'test' }>('NODE_ENV')).toBe('test')
    expect(service.get('NODE_ENV')).toBe('test')
  })

  it('should return undefined env', () => {
    expect(service.env<{ ENV: 'local' }>('ENV')).toBeUndefined()
    expect(service.get('ENV')).toBeUndefined()
  })
})

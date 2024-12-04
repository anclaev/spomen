import { CreateTokenHandler } from '../CreateTokenHandler'
import { Provider } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { CreateTokenCommand } from '../CreateTokenCommand'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@spomen/core'
import { AuthRepository } from '../../../infrastructure/AuthRepository'
import { AuthFactory } from '../../../domain/AuthFactory'
import { InjectionToken } from '../../injection-token'

describe('CreateTokenHandler', () => {
  let handler: CreateTokenHandler
  let repository: AuthRepository
  let factory: AuthFactory
  let jwtService: JwtService
  let configService: ConfigService

  beforeEach(async () => {
    const repoProvider = {
      provide: InjectionToken.AUTH_REPOSITORY,
      useValue: {},
    }

    const factoryProvider: Provider = {
      provide: AuthFactory,
      useValue: {},
    }

    const providers: Provider[] = [
      repoProvider,
      factoryProvider,
      {
        provide: JwtService,
        useValue: {},
      },
      {
        provide: ConfigService,
        useValue: {},
      },
      CreateTokenHandler,
    ]

    const testModule = await Test.createTestingModule({ providers }).compile()

    handler = testModule.get(CreateTokenHandler)
    jwtService = testModule.get(JwtService)
    configService = testModule.get(ConfigService)
    repository = testModule.get(InjectionToken.AUTH_REPOSITORY)
    factory = testModule.get(AuthFactory)
  })

  it('should execute', async () => {
    const token = { create: jest.fn(), commit: jest.fn() }

    configService.env = jest.fn().mockReturnValue('env')
    jwtService.signAsync = jest.fn().mockResolvedValue('token')
    factory.create = jest.fn().mockReturnValue(token)
    repository.create = jest.fn().mockResolvedValue(token)

    const command = new CreateTokenCommand({
      id: 'test',
      login: 'test',
      email: 'test',
    })

    await expect(handler.execute(command)).resolves.toEqual({
      access_token: 'token',
      refresh_token: 'token',
    })
    expect(token.create).toBeCalledTimes(1)
    expect(repository.create).toBeCalledTimes(1)
    expect(repository.create).toBeCalledWith(token)
    expect(token.commit).toBeCalledTimes(1)
  })
})

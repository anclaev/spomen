import { Provider } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AccountRepository } from '../../../infrastructure/AccountRepository'
import { AccountFactory } from '../../../domain/AccountFactory'
import { CreateAccountHandler } from '../CreateAccountHandler'
import { CreateAccountCommand } from '../CreateAccountCommand'
import { InjectionToken } from '../../injection-token'

describe('CreateAccountHandler', () => {
  let handler: CreateAccountHandler
  let repository: AccountRepository
  let factory: AccountFactory

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    }

    const factoryProvider: Provider = {
      provide: AccountFactory,
      useValue: {},
    }

    const providers: Provider[] = [
      repoProvider,
      factoryProvider,
      CreateAccountHandler,
    ]

    const testModule = await Test.createTestingModule({ providers }).compile()

    handler = testModule.get(CreateAccountHandler)
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY)
    factory = testModule.get(AccountFactory)
  })

  it('should execute', async () => {
    const account = { create: jest.fn(), commit: jest.fn() }

    factory.create = jest.fn().mockReturnValue(account)
    repository.create = jest.fn().mockResolvedValue(account)

    const command = new CreateAccountCommand({
      password: 'test',
      email: 'test',
    })

    await expect(handler.execute(command)).resolves.toEqual(account)
    expect(account.create).toBeCalledTimes(1)
    expect(repository.create).toBeCalledTimes(1)
    expect(repository.create).toBeCalledWith(account)
    expect(account.commit).toBeCalledTimes(1)
  })
})

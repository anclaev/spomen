import { Provider } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { v4 } from 'uuid'

import { AccountRepository } from '../../../infrastructure/repository/account.repository'

import { AccountFactory } from '../../../domain/AccountFactory'

import { SignUpHandler } from '../SignUpHandler'
import { SignUpCommand } from '../SignUpCommand'

import { InjectionToken } from '../../injection-token'

describe('SignUpHandler', () => {
  let handler: SignUpHandler
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

    const providers: Provider[] = [repoProvider, factoryProvider, SignUpHandler]

    const testModule = await Test.createTestingModule({ providers }).compile()

    handler = testModule.get(SignUpHandler)
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY)
    factory = testModule.get(AccountFactory)
  })

  it('should execute', async () => {
    const account = { create: jest.fn(), commit: jest.fn() }
    const client_id = v4()

    factory.create = jest.fn().mockReturnValue(account)
    repository.create = jest.fn().mockResolvedValue(account)

    const command = new SignUpCommand({
      email: 'test@mail.ru',
      username: 'test',
      password: 'password',
      client_id,
    })

    await expect(handler.execute(command)).resolves.toEqual(account)
    expect(account.create).toBeCalledTimes(1)
    expect(account.create).toBeCalledWith(client_id)
    expect(repository.create).toBeCalledTimes(1)
    expect(repository.create).toBeCalledWith(account)
    expect(account.commit).toBeCalledTimes(1)
  })
})

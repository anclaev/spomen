import { Provider } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { v4 } from 'uuid'

import { AccountFactory } from '../../../domain/AccountFactory'

import { OAuthClientRepository } from '../../../infrastructure/oauth/OAuthClient.repository'
import { AccountRepository } from '../../../infrastructure/repository/account.repository'
import { SIGN_UP_STATUS } from '../../../infrastructure/Enums'

import { SignUpHandler } from '../SignUpHandler'
import { SignUpCommand } from '../SignUpCommand'

import { InjectionToken } from '../../injection-token'

describe('SignUpHandler', () => {
  let handler: SignUpHandler
  let accountRepository: AccountRepository
  let OAuthClientRepository: OAuthClientRepository
  let factory: AccountFactory

  beforeEach(async () => {
    const accountRepo: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    }

    const clientRepo: Provider = {
      provide: InjectionToken.OAUTH_CLIENT_REPOSITORY,
      useValue: {},
    }

    const factoryProvider: Provider = {
      provide: AccountFactory,
      useValue: {},
    }

    const providers: Provider[] = [
      accountRepo,
      clientRepo,
      factoryProvider,
      SignUpHandler,
    ]

    const testModule = await Test.createTestingModule({ providers }).compile()

    handler = testModule.get(SignUpHandler)
    factory = testModule.get(AccountFactory)
    accountRepository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY)
    OAuthClientRepository = testModule.get(
      InjectionToken.OAUTH_CLIENT_REPOSITORY
    )
  })

  it('should execute', async () => {
    const account = { create: jest.fn(), commit: jest.fn() }

    const client = {
      id: v4(),
    }

    factory.create = jest.fn().mockReturnValue(account)
    accountRepository.create = jest.fn().mockResolvedValue(account)
    OAuthClientRepository.findById = jest.fn().mockResolvedValue(client)

    const command = new SignUpCommand({
      email: 'test@mail.ru',
      username: 'test',
      password: 'password',
      client_id: client.id,
    })

    await expect(handler.execute(command)).resolves.toEqual({
      account,
      status: SIGN_UP_STATUS.SUCCESS,
    })
    expect(account.create).toBeCalledTimes(1)
    expect(account.create).toBeCalledWith(client.id)
    expect(OAuthClientRepository.findById).toBeCalledTimes(1)
    expect(OAuthClientRepository.findById).toBeCalledWith(client.id)
    expect(accountRepository.create).toBeCalledTimes(1)
    expect(accountRepository.create).toBeCalledWith(account)
    expect(account.commit).toBeCalledTimes(1)
  })
})

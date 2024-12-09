import { Provider } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AccountRepository } from '../../../infrastructure/repository/account.repository'
import { TokenService } from '../../../infrastructure/token/token.service'

import { ConfirmEmailHandler } from '../ConfirmEmailHandler'

import { IConfirmToken } from '../../../infrastructure/token/Tokens'
import { ConfirmEmailCommand } from '../ConfirmEmailCommand'
import { InjectionToken } from '../../injection-token'

import { v4 } from 'uuid'

import {
  CONFIRM_EMAIL_STATUS,
  TOKEN_TYPES,
} from '../../../infrastructure/Enums'

import { TokenExpiredError } from '@nestjs/jwt'

describe('ConfirmEmailHandler', () => {
  let handler: ConfirmEmailHandler
  let repository: AccountRepository
  let token: TokenService

  beforeEach(async () => {
    const repoProvider: Provider = {
      provide: InjectionToken.ACCOUNT_REPOSITORY,
      useValue: {},
    }

    const tokenProvider = {
      provide: InjectionToken.TOKEN_SERVICE,
      useValue: {},
    }

    const providers: Provider[] = [
      repoProvider,
      tokenProvider,
      ConfirmEmailHandler,
    ]

    const testModule = await Test.createTestingModule({ providers }).compile()

    handler = testModule.get(ConfirmEmailHandler)
    repository = testModule.get(InjectionToken.ACCOUNT_REPOSITORY)
    token = testModule.get(InjectionToken.TOKEN_SERVICE)
  })

  it('should return SUCCESS', async () => {
    const account = {
      commit: jest.fn(),
      confirm: jest.fn(),
      getUsername: jest.fn(),
      getEmail: jest.fn(),
      getStatus: jest.fn().mockReturnValue('PENDING'),
    }

    const account_id = v4()

    const confirmToken: IConfirmToken = {
      version: 0,
      exp: 111111,
      iat: 111111,
      iss: 'test',
      sub: account_id,
      user: {
        email: 'test@mail.ru',
        username: 'test',
        id: account_id,
      },
    }

    const confirmJwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    token.verifyToken = jest.fn().mockResolvedValue(confirmToken)
    repository.findById = jest.fn().mockResolvedValue(account)
    repository.update = jest.fn()

    const command = new ConfirmEmailCommand({
      token: confirmJwtToken,
    })

    await expect(handler.execute(command)).resolves.toEqual(
      CONFIRM_EMAIL_STATUS.SUCCESS
    )
    expect(account.confirm).toBeCalledTimes(1)
    expect(account.commit).toBeCalledTimes(1)
    expect(repository.findById).toBeCalledTimes(1)
    expect(repository.update).toBeCalledTimes(1)
    expect(repository.update).toBeCalledWith(account_id, account)
    expect(token.verifyToken).toBeCalledTimes(1)
    expect(token.verifyToken).toBeCalledWith(
      confirmJwtToken,
      TOKEN_TYPES.CONFIRMATION
    )
  })

  it('should return EXPIRED', async () => {
    token.verifyToken = jest
      .fn()
      .mockRejectedValue(new TokenExpiredError('TokenExpiredError', new Date()))

    const confirmJwtToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    const command = new ConfirmEmailCommand({
      token: confirmJwtToken,
    })

    await expect(handler.execute(command)).resolves.toEqual(
      CONFIRM_EMAIL_STATUS.EXPIRED
    )
    expect(token.verifyToken).toBeCalledTimes(1)
    expect(token.verifyToken).toBeCalledWith(
      confirmJwtToken,
      TOKEN_TYPES.CONFIRMATION
    )
  })

  // TODO: Описать все сценарии, когда возвращается INVALID
})

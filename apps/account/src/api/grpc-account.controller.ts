import {
  AccountCredentialsWithPasskey,
  AccountCredentialsWithPassword,
  CreateAccountSchema,
  expectGrpcValidationError,
  GetAccountByEmailPayload,
  GetAccountByLoginPayload,
  Status,
} from '@spomen/core'

import { GrpcMethod, RpcException } from '@nestjs/microservices'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Controller } from '@nestjs/common'
import * as grpc from '@grpc/grpc-js'

import {
  GetAccountByEmailSchema,
  GetAccountByLoginSchema,
} from '../application/dtos/GetAccountDTO'

import { AccountByEmailQuery } from '../application/queries/AccountByEmailQuery'
import { AccountByLoginQuery } from '../application/queries/AccountByLoginQuery'

import { CreateAccountCommand } from '../application/commands/CreateAccountCommand'

import { CreateAccountDTO } from '../application/dtos/CreateAccountDTO'

import { AccountEntity } from '../infrastructure/AccountEntity'
import { IAccount } from '../domain/Account'

@Controller()
export class GrpcAccountController {
  constructor(
    readonly queryBus: QueryBus,
    readonly commandBus: CommandBus
  ) {}

  @GrpcMethod('AccountService', 'GetAccountPasswordByLogin')
  async GetAccountPasswordByLogin(
    data: GetAccountByLoginPayload
  ): Promise<AccountCredentialsWithPassword> {
    await expectGrpcValidationError(GetAccountByLoginSchema.safeParse(data))

    const account = await this.getAccountByLogin(data.login)

    return {
      id: account.id,
      email: account.email,
      login: account.login,
      password: account.password,
    }
  }

  @GrpcMethod('AccountService', 'GetAccountPasswordByEmail')
  async GetAccountPasswordByEmail(
    data: GetAccountByEmailPayload
  ): Promise<AccountCredentialsWithPassword> {
    await expectGrpcValidationError(GetAccountByEmailSchema.safeParse(data))

    const account = await this.getAccountByEmail(data.email)

    return {
      id: account.id,
      email: account.email,
      login: account.login,
      password: account.password,
    }
  }

  @GrpcMethod('AccountService', 'GetAccountPasskeyByLogin')
  async GetAccountPasskeyByLogin(
    data: GetAccountByLoginPayload
  ): Promise<AccountCredentialsWithPasskey> {
    await expectGrpcValidationError(GetAccountByLoginSchema.safeParse(data))

    const account = await this.getAccountByLogin(data.login)

    return {
      id: account.id,
      email: account.email,
      login: account.login,
      passkey: account.passkey,
    }
  }

  @GrpcMethod('AccountService', 'GetAccountPasskeyByEmail')
  async GetAccountPasskeyByEmail(
    data: GetAccountByEmailPayload
  ): Promise<AccountCredentialsWithPasskey> {
    await expectGrpcValidationError(GetAccountByEmailSchema.safeParse(data))

    const account = await this.getAccountByEmail(data.email)

    return {
      id: account.id,
      email: account.email,
      login: account.login,
      passkey: account.passkey,
    }
  }

  @GrpcMethod('AccountService', 'CreateAccount')
  async CreateAccount(data: CreateAccountDTO): Promise<Status> {
    await expectGrpcValidationError(CreateAccountSchema.safeParse(data))

    try {
      const account = await this.commandBus.execute<
        CreateAccountCommand,
        IAccount
      >(new CreateAccountCommand(data))

      return {
        status: !!account,
      }
    } catch (e) {
      throw new RpcException({
        code: grpc.status.ALREADY_EXISTS,
        message: 'Аккаунт уже существует',
      })
    }
  }

  private async getAccountByLogin(login: string): Promise<AccountEntity> {
    const account = await this.queryBus.execute<
      AccountByLoginQuery,
      AccountEntity | null
    >(new AccountByLoginQuery(login))

    return this.withRpcException(account)
  }

  private async getAccountByEmail(email: string): Promise<AccountEntity> {
    const account = await this.queryBus.execute<
      AccountByEmailQuery,
      AccountEntity | null
    >(new AccountByEmailQuery(email))

    return this.withRpcException(account)
  }

  private withRpcException(account: AccountEntity | null): AccountEntity {
    if (!account) {
      throw new RpcException({
        code: grpc.status.NOT_FOUND,
        message: 'NOT FOUND',
      })
    }

    return account
  }
}

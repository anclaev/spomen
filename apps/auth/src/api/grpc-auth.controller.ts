import {
  expectGrpcValidationError,
  LoginOptionalFields,
  LoginWithPasskeyPayload,
  LoginWithPasskeySchema,
  LoginWithPasswordPayload,
  LoginWithPasswordSchema,
  Tokens,
} from '@spomen/core'

import { GrpcMethod, RpcException } from '@nestjs/microservices'
import { Controller } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import * as grpc from '@grpc/grpc-js'

import { LoginWithPasswordCommand } from '../application/commands/LoginWithPasswordCommand'
import { LoginWithPasskeyCommand } from '../application/commands/LoginWithPasskeyCommand'

@Controller()
export class GrpcAuthController {
  constructor(readonly commandBus: CommandBus) {}

  @GrpcMethod('AuthService', 'LoginWithPassword')
  async LoginWithPassword(payload: LoginWithPasswordPayload): Promise<Tokens> {
    expectGrpcValidationError(LoginWithPasswordSchema.safeParse(payload))

    this.checkAccountFields(payload)

    const res = await this.commandBus.execute<
      LoginWithPasswordCommand,
      Tokens | null
    >(new LoginWithPasswordCommand(payload))

    if (!res)
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Авторизация не пройдена',
      })

    return res
  }

  @GrpcMethod('AuthService', 'LoginWithPasskey')
  async LoginWithPasskey(payload: LoginWithPasskeyPayload): Promise<Tokens> {
    expectGrpcValidationError(LoginWithPasskeySchema.safeParse(payload))

    this.checkAccountFields(payload)

    const res = await this.commandBus.execute<
      LoginWithPasskeyCommand,
      Tokens | null
    >(new LoginWithPasskeyCommand(payload))

    if (!res)
      throw new RpcException({
        code: grpc.status.UNAUTHENTICATED,
        message: 'Авторизация не пройдена',
      })

    return res
  }

  private checkAccountFields(payload: LoginOptionalFields): void {
    if (!payload.login && !payload.email) {
      throw new RpcException({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Некорректные данные',
      })
    }
  }
}

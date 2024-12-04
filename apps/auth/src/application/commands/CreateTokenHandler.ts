import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ConfigService, Tokens } from '@spomen/core'
import { JwtService } from '@nestjs/jwt'
import { Inject } from '@nestjs/common'

import { AuthRepository } from '../../infrastructure/AuthRepository'

import { AuthFactory } from '../../domain/AuthFactory'

import { CreateTokenCommand } from './CreateTokenCommand'
import { InjectionToken } from '../injection-token'
import { ENV } from '../../infrastructure/Config'

@CommandHandler(CreateTokenCommand)
export class CreateTokenHandler
  implements ICommandHandler<CreateTokenCommand, Tokens>
{
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    @Inject(InjectionToken.AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
    @Inject()
    private readonly authFactory: AuthFactory
  ) {}

  async execute({ payload }: CreateTokenCommand): Promise<Tokens> {
    const tokens = {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: this.config.env<ENV>('ACCESS_TOKEN_EXPIRATION'),
        secret: this.config.env<ENV>('ACCESS_TOKEN_SECRET'),
      }),
      refresh_token: await this.jwt.signAsync(payload, {
        expiresIn: this.config.env<ENV>('ACCESS_TOKEN_EXPIRATION'),
        secret: this.config.env<ENV>('ACCESS_TOKEN_SECRET'),
      }),
    }

    const token = await this.authFactory.create({
      account_id: payload!.id,
      refresh_token: tokens.refresh_token,
    })

    const createdToken = await this.authRepository.create(token)

    createdToken.create()
    createdToken.commit()

    return tokens
  }
}

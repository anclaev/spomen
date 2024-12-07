import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt'
import { ConfigService } from '@spomen/core'
import { Injectable } from '@nestjs/common'

import { IConfirmPayload, IRefreshPayload, ITokenPayload } from './Tokens'

import { TOKEN_TYPES } from '../Enums'
import { ENV, ISSUER } from '../Config'

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async generateToken(
    payload: ITokenPayload | IRefreshPayload | IConfirmPayload,
    type: TOKEN_TYPES
  ): Promise<string> {
    const options: JwtSignOptions = {
      issuer: ISSUER,
      subject: payload.account_id,
      algorithm: 'HS256',
    }

    switch (type) {
      case TOKEN_TYPES.ACCESS:
        return await this.jwt.signAsync(payload, {
          ...options,
          privateKey: this.config.env<ENV>('ACCESS_PRIVATE_KEY'),
          algorithm: 'RS256',
          expiresIn: Number(this.config.env<ENV>('ACCESS_TOKEN_EXPIRATION')),
        })
      case TOKEN_TYPES.REFRESH:
        return await this.jwt.signAsync(payload, {
          ...options,
          secret: this.config.env<ENV>('REFRESH_TOKEN_SECRET'),
          expiresIn: Number(this.config.env<ENV>('REFRESH_TOKEN_EXPIRATION')),
        })
      case TOKEN_TYPES.CONFIRMATION:
        return await this.jwt.signAsync(payload, {
          ...options,
          secret: this.config.env<ENV>('CONFIRMATION_TOKEN_SECRET'),
          expiresIn: Number(
            this.config.env<ENV>('CONFIRMATION_TOKEN_EXPIRATION')
          ),
        })
      case TOKEN_TYPES.RESET:
        return await this.jwt.signAsync(payload, {
          ...options,
          secret: this.config.env<ENV>('RESET_TOKEN_SECRET'),
          expiresIn: Number(this.config.env<ENV>('RESET_TOKEN_EXPIRATION')),
        })
    }
  }

  async verifyToken(token: string, type: TOKEN_TYPES): Promise<any> {
    const options: JwtVerifyOptions = {
      issuer: ISSUER,
      algorithms: ['HS256'],
    }

    switch (type) {
      case TOKEN_TYPES.ACCESS:
        return await this.jwt.verifyAsync(token, {
          ...options,
          algorithms: ['RS256'],
          maxAge: this.config.env<ENV>('ACCESS_TOKEN_EXPIRATION'),
          publicKey: this.config.env<ENV>('ACCESS_PUBLIC_KEY'),
        })
      case TOKEN_TYPES.REFRESH:
        return await this.jwt.verifyAsync(token, {
          ...options,
          maxAge: this.config.env<ENV>('REFRESH_TOKEN_EXPIRATION'),
          secret: this.config.env<ENV>('REFRESH_TOKEN_SECRET'),
        })
      case TOKEN_TYPES.CONFIRMATION:
        return await this.jwt.verifyAsync(token, {
          ...options,
          maxAge: this.config.env<ENV>('CONFIRMATION_TOKEN_EXPIRATION'),
          secret: this.config.env<ENV>('CONFIRMATION_TOKEN_SECRET'),
        })
      case TOKEN_TYPES.RESET:
        return await this.jwt.verifyAsync(token, {
          ...options,
          maxAge: this.config.env<ENV>('RESET_TOKEN_EXPIRATION'),
          secret: this.config.env<ENV>('RESET_TOKEN_SECRET'),
        })
    }
  }
}

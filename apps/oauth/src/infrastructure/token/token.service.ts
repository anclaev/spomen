import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt'
import { ConfigService } from '@spomen/core'
import { Injectable } from '@nestjs/common'

import { GenerateTokenPayload } from './Tokens'

import { ENV, ISSUER } from '../Config'
import { TOKEN_TYPES } from '../Enums'
import moment from 'moment'

interface ITokenService {
  decodeToken<T>(token: string): Promise<T>
  generateToken(
    payload: GenerateTokenPayload,
    type: TOKEN_TYPES
  ): Promise<string>
  verifyToken<T extends object>(token: string, type: TOKEN_TYPES): Promise<T>
}

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async decodeToken<T>(token: string): Promise<T> {
    return this.jwt.decode<T>(token)
  }

  async generateToken(
    payload: GenerateTokenPayload,
    type: TOKEN_TYPES
  ): Promise<string> {
    const options: JwtSignOptions = {
      issuer: ISSUER,
      subject: payload.user.id,
      algorithm: 'HS256',
    }

    switch (type) {
      case TOKEN_TYPES.AUTHORIZATION_CODE:
        return await this.jwt.signAsync(
          {
            ...payload,
            expiresAt: moment()
              .add(Number(this.config.env<ENV>('ACCESS_TOKEN_EXPIRATION')), 's')
              .toDate(),
          },
          {
            ...options,
            privateKey: this.config.env<ENV>('ACCESS_PRIVATE_KEY'),
            algorithm: 'RS256',
            expiresIn: Number(this.config.env<ENV>('ACCESS_TOKEN_EXPIRATION')),
          }
        )

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

  async verifyToken<T extends object>(
    token: string,
    type: TOKEN_TYPES
  ): Promise<T> {
    const options: JwtVerifyOptions = {
      issuer: ISSUER,
      algorithms: ['HS256'],
    }

    switch (type) {
      case TOKEN_TYPES.ACCESS:
        return await this.jwt.verifyAsync(token, {
          ...options,
          algorithms: ['RS256'],
          publicKey: this.config.env<ENV>('ACCESS_PUBLIC_KEY'),
        })
      case TOKEN_TYPES.REFRESH:
        return await this.jwt.verifyAsync(token, {
          ...options,
          secret: this.config.env<ENV>('REFRESH_TOKEN_SECRET'),
        })
      case TOKEN_TYPES.CONFIRMATION:
        return await this.jwt.verifyAsync(token, {
          ...options,
          secret: this.config.env<ENV>('CONFIRMATION_TOKEN_SECRET'),
        })
      case TOKEN_TYPES.RESET:
        return await this.jwt.verifyAsync(token, {
          ...options,
          secret: this.config.env<ENV>('RESET_TOKEN_SECRET'),
        })
    }
  }
}

import { AuthorizationCode, Token } from 'oauth2-server'
import { Controller, Post } from '@nestjs/common'
import { of } from 'rxjs'

import {
  OAuth2Authenticate,
  OAuth2Authorization,
  OAuth2RenewToken,
  OAuth2Token,
} from '@boyuai/nestjs-oauth2-server'

@Controller('oauth')
export class OAuthController {
  @Post('authorize')
  authorizeClient(
    @OAuth2Authorization()
    authorization: AuthorizationCode
  ) {
    return of(authorization)
  }

  @Post('token')
  @OAuth2Authenticate()
  grantToken(@OAuth2Token() token: Token) {
    return of(token)
  }

  @Post('refresh')
  @OAuth2RenewToken()
  refreshToken(@OAuth2Token() token: Token) {
    return of(token)
  }
}

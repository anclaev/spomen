import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

import { OAuthLoginQueryType } from '../../app/dtos/OAuthLoginQuery.dto'

import { OAUTH_ENDPOINTS } from './OAuth'

import { OAuthParamsStr } from '../utils/params'

@Injectable()
export class OAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { query } = req

    const isProd =
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'staging'

    const redirectUri = `${isProd ? 'https' : 'http'}://${process.env.DOMAIN}${OAUTH_ENDPOINTS.LOGIN}?${OAuthParamsStr(query as OAuthLoginQueryType)}`

    const cookie = req.cookies['oauth']

    if (!cookie) {
      return res.redirect(303, redirectUri)
    }

    next()
  }
}

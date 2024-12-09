import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common'

import { Request } from 'express'

import { AuthService } from '../auth/auth.service'

import { InjectionToken } from '../../app/injection-token'

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(
    @Inject(InjectionToken.AUTH_SERVICE) private readonly auth: AuthService
  ) {}

  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>()

    if (!req || !req.query || !req.query.client_id || !req.query.client_secret)
      return false

    const query = req.query as { client_id: string; client_secret: string }
    return this.auth
      .validateClient(query.client_id, query.client_secret)
      .then((res) => res.status === 'SUCCESS')
  }
}

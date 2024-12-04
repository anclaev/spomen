import { IQuery } from '@nestjs/cqrs'

export class AccountByLoginQuery implements IQuery {
  constructor(readonly login: string) {}
}

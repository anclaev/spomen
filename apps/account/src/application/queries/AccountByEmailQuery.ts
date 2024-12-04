import { IQuery } from '@nestjs/cqrs'

export class AccountByEmailQuery implements IQuery {
  constructor(readonly email: string) {}
}

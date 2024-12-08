import { ICommand } from '@nestjs/cqrs'

import { ConfirmEmailQueryDtoType } from '../dtos/ConfirmEmailQuery.dto'

export class ConfirmEmailCommand implements ICommand {
  constructor(readonly dto: ConfirmEmailQueryDtoType) {}
}

import { UseGuards } from '@nestjs/common'

import { ClientGuard } from './client.guard'

export const ValidateClient = () => UseGuards(ClientGuard)

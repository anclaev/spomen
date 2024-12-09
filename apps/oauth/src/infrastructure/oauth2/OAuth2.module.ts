import { CqrsModule } from '@nestjs/cqrs'
import { Module } from '@nestjs/common'

import { OAuth2Controller } from '../../api/OAuth2.controller'

@Module({
  imports: [CqrsModule],
  controllers: [OAuth2Controller],
})
export class OAuth2Module {}

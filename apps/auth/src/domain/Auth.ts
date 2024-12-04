import { AggregateRoot } from '@nestjs/cqrs'

export type AuthEssentialProps = Readonly<
  Required<{
    account_id: string
    refresh_token: string
  }>
>

export type AuthOptionalProps = Readonly<
  Partial<{
    id: string
    created_at: Date
    updated_at: Date
  }>
>

export type AuthProps = AuthEssentialProps & AuthOptionalProps

export interface IAuth {
  create(): void
  remove(): void
  commit(): void
}

export class Auth extends AggregateRoot implements IAuth {
  private readonly id: string
  private account_id: string
  private refresh_token: string
  private readonly created_at: Date
  private readonly updated_at: Date

  constructor(props: AuthProps) {
    super()
    // noinspection TypeScriptValidateTypes
    Object.assign(this, props)
  }

  create(): void {
    // this.apply(new AccountCreatedEvent(this.id))
  }

  remove(): void {
    // this.apply(new AccountRemovedEvent(this.id))
  }
}

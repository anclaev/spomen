import { LoginWithPasskeyPayload, LoginWithPasswordPayload, Tokens } from './'

export interface AuthService {
  LoginWithPassword(payload: LoginWithPasswordPayload): Promise<Tokens>
  LoginWithPasskey(payload: LoginWithPasskeyPayload): Promise<Tokens>
}

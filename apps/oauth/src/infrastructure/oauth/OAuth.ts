export interface IUser {
  id: string
  username: string
  email: string
}

export enum OAUTH_ENDPOINTS {
  LOGIN = '/oauth/login',
  AUTHORIZE = '/oauth/authorize',
  TOKEN = '/oauth/token',
}

export enum OAUTH_CLIENT_GRANTS {
  ROOT = 'ROOT',
  REGISTER_ACCOUNTS = 'REGISTER_ACCOUNTS',
  AUTHENTICATE_USERS = 'AUTHENTICATE_USERS',
}

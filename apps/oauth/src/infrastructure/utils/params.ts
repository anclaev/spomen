import { OAuthAuthorizeQueryType } from '../../app/dtos/OAuthAuthorizeQuery.dto'
import { OAuthTokenQueryType } from '../../app/dtos/OAuthTokenQuery.dto'
import { OAuthLoginQueryType } from '../../app/dtos/OAuthLoginQuery.dto'

export const OAuthParamsStr = (
  params: OAuthLoginQueryType | OAuthAuthorizeQueryType | OAuthTokenQueryType
): string => {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&')
}

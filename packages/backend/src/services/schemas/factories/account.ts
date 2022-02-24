import { Account } from '../schemas'
import { AccountModel, AccountTokenModel } from '../../data/account'

export function createAccount(
  clientId: string,
  model: AccountModel,
  token: AccountTokenModel
) {
  const acc = new Account()
  acc.username = model.username
  acc.currentClientId = clientId
  acc.accountId = model.accountId
  // for connecting to extraneous services without logging in for 24 hrs
  acc.token.token = token.token
  acc.token.expires = token.expires.valueOf()
  return acc
}

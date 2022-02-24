import { Account } from '../schemas'
import { AccountModel } from '../../data/account'

export function createAccount(clientId: string, model: AccountModel) {
  const acc = new Account()
  acc.username = model.username
  acc.currentClientId = clientId
  acc.accountId = model.accountId
  return acc
}

import { Account } from '../schemas'
import { v4 } from 'uuid'
import { AccountModel } from '../../data/models/account'

export function createAccount(clientId: string, model: AccountModel) {
  const acc = new Account()
  acc.username = model.username
  acc.currentClientId = clientId
  acc.accountId = model.accountId
  return acc
}

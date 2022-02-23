import { Account } from '../schemas'
import { v4 } from 'uuid'

export function createAccount(clientId: string, username: string) {
  const acc = new Account()
  acc.username = username
  acc.currentClientId = clientId
  acc.accountId = v4()
  return acc
}

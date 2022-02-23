import { Account, Character } from '../schemas'
import { v4 } from 'uuid'

export function createCharacter(name: string, account: Account) {
  const char = new Character()
  char.name = name
  char.accountId = account.accountId
  char.currentClientId = account.currentClientId
  char.characterId = v4()
  char.position.map = 'starter'
  return char
}

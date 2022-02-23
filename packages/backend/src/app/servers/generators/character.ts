import { Account, Character } from '../schemas'
import { CharacterModel } from '../../data/models/character'

export function createCharacter(model: CharacterModel, account: Account) {
  const char = new Character()
  char.name = model.name
  char.characterId = model.characterId
  char.accountId = account.accountId
  char.currentClientId = account.currentClientId
  char.position.map = 'starter'
  return char
}

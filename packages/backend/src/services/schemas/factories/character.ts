import { Account, Appearance, Character } from '../schemas'
import { CharacterModel } from '../../data/character'

export function createCharacter(model: CharacterModel, account: Account) {
  const char = new Character()
  char.name = model.name
  char.characterId = model.characterId
  char.accountId = account.accountId
  char.currentClientId = account.currentClientId
  const { eyes, eyeColor, hair, hairColor, skinColor, gender } = char.appearance
  char.appearance = new Appearance({
    eyes,
    eyeColor,
    hair,
    hairColor,
    skinColor,
    gender,
  })
  char.position.map = 'starter'
  return char
}

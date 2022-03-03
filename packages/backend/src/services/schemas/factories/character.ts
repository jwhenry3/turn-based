import {
  Account,
  Appearance,
  Character,
  Movement,
  PositionData,
} from '../schemas'
import { CharacterModel } from '../../data/character'
import { Statistics } from '../battles'

export function createCharacter(model: CharacterModel, clientId: string) {
  const char = new Character()
  char.name = model.name
  char.characterId = model.characterId
  char.accountId = model.accountId
  char.currentClientId = clientId
  const { eyes, eyeColor, hair, hairColor, skinColor, gender } = char.appearance
  char.appearance = new Appearance({
    eyes,
    eyeColor,
    hair,
    hairColor,
    skinColor,
    gender,
  })
  char.position = new PositionData({
    x: model.position.x,
    y: model.position.y,
    map: model.position.map,
    movement: new Movement({
      facing: model.position.facing,
    }),
  })
  char.stats = new Statistics()
  char.position.map = 'starter'
  return char
}

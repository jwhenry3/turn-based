import { AppearanceModel } from '../appearance'
import { CharacterModel } from '../character'
import { Identities } from './identities'

export class Characters {
  static async getCharactersForAccount(accountId: string) {
    return await CharacterModel.findAll({
      where: {
        accountId,
      },
    })
  }

  static async getCharacterForAccount(
    accountId: string,
    characterId: string
  ) {
    return await CharacterModel.findOne({ where: { accountId, characterId } })
  }

  static async getCharacterById(characterId: string) {
    return await CharacterModel.findOne({ where: { characterId } })
  }

  static async createCharacter(
    accountId: string,
    { name, appearance }: Partial<CharacterModel>
  ) {
    const { hair, hairColor, eyes, eyeColor, skinColor, gender } =
      appearance || {}
    const characterId = Identities.id()
    return await CharacterModel.create({
      characterId,
      accountId,
      name,
      appearance: new AppearanceModel({
        appearanceId: Identities.id(),
        characterId,
        hair: hair || 'a',
        hairColor: hairColor || 'brown',
        eyes: eyes || 'a',
        eyeColor: eyeColor || 'green',
        skinColor: skinColor || 'beige',
        gender: gender || 'male',
      }),
    })
  }
  static updatePosition(
    model: CharacterModel,
    position: { x: number; y: number }
  ) {}
  static updateMap(model: CharacterModel, map: string) {}
}

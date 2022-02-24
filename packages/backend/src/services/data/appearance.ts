import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { CharacterModel } from './character'
import { v4 } from 'uuid'

@Table
export class AppearanceModel extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column
  appearanceId: string

  @ForeignKey(() => CharacterModel)
  @AllowNull(false)
  @Column
  characterId: string

  @AllowNull(false)
  @Column
  eyes: string = 'a'

  @AllowNull(false)
  @Column
  eyeColor: string = 'brown'

  @AllowNull(false)
  @Column
  hair: string = 'a'

  @AllowNull(false)
  @Column
  hairColor: string = 'brown'

  @AllowNull(false)
  @Column
  skinColor: string = 'tan'

  @AllowNull(false)
  @Column
  gender: string = 'male'

  static id() {
    return v4()
  }
}

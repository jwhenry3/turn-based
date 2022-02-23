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

  @BelongsTo(() => CharacterModel, 'characterId')
  character: CharacterModel

  @AllowNull(false)
  @Column
  eyes: string

  @AllowNull(false)
  @Column
  eyeColor: string

  @AllowNull(false)
  @Column
  hair: string
  @AllowNull(false)
  @Column
  hairColor: string
  @AllowNull(false)
  @Column
  skinColor: string
  @AllowNull(false)
  @Column
  gender: string

  static id() {
    return v4()
  }
}

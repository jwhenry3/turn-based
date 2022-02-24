import {
  AllowNull,
  Column,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript'
import { v4 } from 'uuid'
import { AppearanceModel } from './appearance'

@Table
export class CharacterModel extends Model {
  @AllowNull(false)
  @Column
  accountId: string

  @PrimaryKey
  @AllowNull(false)
  @Column
  characterId: string

  @AllowNull(false)
  @Unique
  @Column
  name: string

  @HasOne(() => AppearanceModel)
  appearance: AppearanceModel

  static id() {
    return v4()
  }
}

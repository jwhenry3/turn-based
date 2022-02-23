import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript'
import { AccountModel } from './account'
import { v4 } from 'uuid'
import { AppearanceModel } from './appearance'

@Table
export class CharacterModel extends Model {
  @ForeignKey(() => AccountModel)
  @AllowNull(false)
  @Column
  accountId: string

  @BelongsTo(() => AccountModel, 'accountId')
  account: AccountModel

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

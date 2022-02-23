import {
  BelongsTo,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { AccountModel } from './account'
import { v4 } from 'uuid'

@Table
export class CharacterModel extends Model {
  @BelongsTo(() => AccountModel, 'accountId')
  account: AccountModel

  @PrimaryKey
  @Column
  characterId: string

  @Column
  name: string
  static id() {
    return v4()
  }
}

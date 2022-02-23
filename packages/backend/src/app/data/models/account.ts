import {
  AllowNull,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import { CharacterModel } from './character'

@Table
export class AccountModel extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column
  accountId: string
  @AllowNull(false)
  @Column
  username: string
  @AllowNull(false)
  @Column
  hashedPassword: string
  @Column
  email: string

  @HasMany(() => CharacterModel)
  characters: CharacterModel[]

  static id() {
    return v4()
  }

  async setPassword(value: string) {
    this.hashedPassword = await bcrypt.hash(value, 10)
  }

  async comparePassword(value: string) {
    return await bcrypt.compare(value, this.hashedPassword)
  }
}

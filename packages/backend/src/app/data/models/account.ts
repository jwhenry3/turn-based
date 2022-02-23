import { Column, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import { CharacterModel } from './character'

const salt = 'petopia-account'
@Table
export class AccountModel extends Model {
  @PrimaryKey
  @Column
  accountId: string
  @Column
  username: string
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
    this.hashedPassword = await bcrypt.hash(value, salt)
  }

  async comparePassword(value: string) {
    return await bcrypt.compare(value, this.hashedPassword)
  }
}

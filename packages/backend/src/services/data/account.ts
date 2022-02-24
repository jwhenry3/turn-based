import {
  AllowNull,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'

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

  static id() {
    return v4()
  }

}

import {
  AllowNull,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

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
}

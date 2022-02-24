import bcrypt from 'bcrypt'
import { AccountModel } from '../account'
import { Identities } from './identities'

export class Accounts {
  static getAccountById(id: string) {}

  static async createAccount(
    username: string,
    password: string,
    email?: string
  ) {
    return await AccountModel.create({
      accountId: Identities.id(),
      username,
      email,
      hashedPassword: await Accounts.hashPassword(password),
    })
  }

  static async verifyAccountByUsername(username: string, password: string) {
    const account = await AccountModel.findOne({ where: { username } })
    if (!account) return undefined
    if (await Accounts.comparePassword(password, account.hashedPassword)) {
      return account
    }
  }
  static verifyAccountByEmail(email: string, password: string) {}

  static async hashPassword(value: string) {
    return await bcrypt.hash(value, 10)
  }

  static async comparePassword(value: string, hashed: string) {
    return await bcrypt.compare(value, hashed)
  }
}

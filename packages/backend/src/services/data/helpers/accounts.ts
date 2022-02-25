import bcrypt from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { AccountModel, AccountTokenModel } from '../account'
import { Identities } from './identities'

const privateKey = 'mmorpg'
export class Accounts {
  static async getAccountById(accountId: string) {
    return await AccountModel.findOne({ where: { accountId } })
  }
  static async getAccountByUsername(username: string) {
    return await AccountModel.findOne({ where: { username } })
  }

  static async createAccount(
    username: string,
    password: string,
    email?: string
  ) {
    if (await Accounts.getAccountByUsername(username)) {
      throw new Error('Username is taken')
    }
    if (!username) {
      throw new Error('Username is required')
    }
    if (!password) {
      throw new Error('Password is required')
    }
    return await AccountModel.create({
      accountId: Identities.id(),
      username,
      email,
      hashedPassword: await Accounts.hashPassword(password),
    })
  }

  static async createToken(accountId: string) {
    const expires = new Date()
    const token = sign({ accountId }, privateKey)
    expires.setDate(expires.getDate() + 1)
    return await AccountTokenModel.create({
      accountId,
      expires,
      token,
    })
  }
  static async getValidToken(accountId: string) {
    const now = new Date()
    return await AccountTokenModel.findOne({
      where: { accountId, expires: { $gt: now } },
    })
  }
  static async invalidateTokens(accountId: string) {
    // set the expires for all tokens for this account, so anyone previously connected will get invalidated (first in, first out)
    // rather than "your account is already logged in", just kick the previous instances on next token check
    await AccountTokenModel.update(
      { expires: new Date() },
      { where: { accountId } }
    )
  }
  static async invalidateToken(token: string) {
    await AccountTokenModel.update(
      { expires: new Date() },
      { where: { token } }
    )
  }
  static async verifyToken(token: string) {
    const model = await AccountTokenModel.findOne({ where: { token } })
    if (model) {
      const now = new Date().valueOf()
      const expires = model.expires.valueOf()
      if (expires < now) {
        await model.destroy()
        return undefined
      }
      const accountId = model.accountId
      const accountModel = AccountModel.findOne({ where: { accountId } })
      if (!accountModel) {
        await model.destroy()
        return undefined
      }
      return accountModel
    }
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

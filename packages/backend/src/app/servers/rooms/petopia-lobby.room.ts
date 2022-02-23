import { Client, LobbyRoom, Room } from 'colyseus'
import {
  ArraySchema,
  filterChildren,
  MapSchema,
  Schema,
  type,
} from '@colyseus/schema'
import { LobbyOptions } from '@colyseus/core/build/rooms/LobbyRoom'
import { Account, Appearance, Character, Statistics } from '../schemas'
import { createCharacter } from '../generators/character'
import { createAccount } from '../generators/account'
import { AccountModel } from '../../data/models/account'
import { InjectModel } from '@nestjs/sequelize'
import { CharacterModel } from '../../data/models/character'

class LobbyState extends Schema {
  @filterChildren((client, key, value: Account, root) => {
    return value.currentClientId === client.sessionId
  })
  @type({ map: Account })
  accounts = new MapSchema<Account>()
}

export class PetopiaLobbyRoom extends Room {
  accountModels: Record<string, AccountModel> = {}

  constructor(
    @InjectModel(AccountModel) protected account: typeof AccountModel,
    @InjectModel(CharacterModel) protected character: typeof CharacterModel
  ) {
    super()
  }
  // Life Cycle
  async onCreate(options: any): Promise<void> {
    this.onMessage('account:login', async (client, { username, password }) => {
      const account = await this.account.findOne({ where: { username } })
      if (account?.comparePassword(password)) {
        this.accountModels[client.sessionId] = account
        const accountSchema = createAccount(client.sessionId, account)
        this.state.accounts.set(client.sessionId, accountSchema)
      } else {
        client.send('account:login:failure', {
          message: 'Invalid username or password',
        })
      }
    })

    this.onMessage(
      'account:register',
      async (client, { username, password }) => {
        try {
          const account = await this.account.create({
            accountId: AccountModel.id(),
            username,
          })
          account.setPassword(password)
          await account.save()
          const accountSchema = createAccount(client.sessionId, account)
          this.accountModels[client.sessionId] = account
          this.state.accounts.set(client.sessionId, accountSchema)
        } catch (e) {
          client.send('account:register:failure', {
            message: 'Account already exists',
          })
        }
      }
    )

    this.onMessage('characters:list', (client, message) => {
      const account = this.state.accounts.get(client.sessionId) as Account
      if (account) {
        const accountModel = this.accountModels[client.sessionId]
        account.characterList = new ArraySchema<Character>()
        for (const character of accountModel.characters) {
          account.characterList.push(createCharacter(character, account))
        }
        account.character = undefined
        return
      }
      client.send('characters:list:failure', {message: 'Could not locate the account on the server, please login again'})
    })

    this.onMessage('characters:select', (client, message) => {
      const account = this.state.accounts.get(client.sessionId) as Account
      if (account) {
        const character = account.characterList.find(
          (character) => character.characterId === message.characterId
        )
        account.character = character
      }
    })

    this.setState(new LobbyState())
  }

  onJoin(client: Client, options: LobbyOptions): void {}

  onLeave(client: Client): void {}
}

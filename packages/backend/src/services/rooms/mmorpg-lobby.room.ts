import { Client, LobbyRoom, Room } from 'colyseus'
import {
  ArraySchema,
  filterChildren,
  MapSchema,
  Schema,
  type,
} from '@colyseus/schema'
import { LobbyOptions } from '@colyseus/core/build/rooms/LobbyRoom'
import { Account, Character } from '../schemas/schemas'
import { createCharacter } from '../schemas/factories/character'
import { createAccount } from '../schemas/factories/account'
import { AccountModel } from '../data/account'
import { Accounts } from '../data/helpers/accounts'
import { Characters } from '../data/helpers/characters'

class LobbyState extends Schema {
  @filterChildren((client, key, value: Account, root) => {
    return value.currentClientId === client.sessionId
  })
  @type({ map: Account })
  accounts = new MapSchema<Account>()
}

export class MmorpgLobbyRoom extends Room {
  accountModels: Record<string, AccountModel> = {}

  // Life Cycle
  async onCreate(): Promise<void> {
    this.onMessage('account:login', async (client, { username, password }) => {
      const account = await Accounts.verifyAccountByUsername(username, password)
      if (!account) {
        client.send('account:login:failure', {
          message: 'Invalid username or password',
        })
        return
      }
      const existingToken = await Accounts.getValidToken(account.accountId)
      if (existingToken) {
        client.send('account:login:failure', {
          message:
            'Already Logged In. Please wait a little while and try again',
        })
        return
      }
      this.accountModels[client.sessionId] = account
      const token = await Accounts.createToken(account.accountId)
      this.state.accounts.set(
        client.sessionId,
        createAccount(client.sessionId, account, token)
      )
    })

    this.onMessage(
      'account:register',
      async (client, { username, password }) => {
        try {
          this.accountModels[client.sessionId] = await Accounts.createAccount(
            username,
            password
          )
          const token = await Accounts.createToken(
            this.accountModels[client.sessionId].accountId
          )
          const accountSchema = createAccount(
            client.sessionId,
            this.accountModels[client.sessionId],
            token
          )
          this.state.accounts.set(client.sessionId, accountSchema)
        } catch (e) {
          console.log(e)
          client.send('account:register:failure', {
            message: 'Could not register that account at this time',
          })
        }
      }
    )

    this.onMessage('characters:list', async (client, message) => {
      const account = this.state.accounts.get(client.sessionId) as Account
      if (account) {
        const accountModel = this.accountModels[client.sessionId]
        const characters = await Characters.getCharactersForAccount(
          accountModel.accountId
        )
        console.log(characters)
        account.characterList = new ArraySchema<Character>()
        for (const character of characters) {
          account.characterList.push(
            createCharacter(character, client.sessionId)
          )
        }
        account.character = undefined
        return
      }

      client.send('characters:list:failure', {
        message:
          'Could not locate the account on the server, please login again',
      })
    })
    this.onMessage('characters:create', async (client, data) => {
      const account = this.state.accounts.get(client.sessionId) as Account
      if (account) {
        const accountModel = this.accountModels[client.sessionId]
        try {
          const character = await Characters.createCharacter(
            accountModel.accountId,
            data
          )

          account.characterList.push(
            createCharacter(character, client.sessionId)
          )
        } catch (e) {
          console.log(e)
          client.send('characters:create:failure', {
            message: 'Name taken',
          })
        }
        return
      }
      client.send('characters:create:failure', {
        message:
          'Could not locate the account on the server, please login again',
      })
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
    this.onMessage('character:logout', (client, message) => {
      if (this.state.accounts[client.sessionId]) {
        this.state.accounts[client.sessionId].character = undefined
      }
    })
    this.onMessage('account:logout', (client, message) => {
      if (this.state.accounts[client.sessionId]) {
        this.state.accounts.delete(client.sessionId)
      }
    })

    this.setState(new LobbyState())
  }

  onJoin(client: Client, options: LobbyOptions): void {}

  async onLeave(client: Client, consented: boolean) {
    try {
      if (consented) {
        throw new Error('Consented leave')
      }
      await this.allowReconnection(client, 30)
    } catch (e) {
      if (this.state.accounts[client.sessionId]) {
        this.state.accounts.delete(client.sessionId)
      }
    }
  }
}

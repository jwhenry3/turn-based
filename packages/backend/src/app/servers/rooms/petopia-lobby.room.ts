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

class LobbyState extends Schema {
  @filterChildren((client, key, value: Account, root) => {
    return value.currentClientId === client.id
  })
  @type({ map: Account })
  accounts = new MapSchema<Account>()
}

export class PetopiaLobbyRoom extends Room {
  // Life Cycle
  async onCreate(options: any): Promise<void> {
    this.onMessage('account:login', (client, message) => {
      this.state.accounts.set(
        client.id,
        createAccount(client.sessionId, message.username)
      )
    })

    this.onMessage('account:register', (client, message) => {
      this.state.accounts.set(
        client.id,
        createAccount(client.sessionId, message.username)
      )
    })

    this.onMessage('characters:list', (client, message) => {
      const account = this.state.accounts.get(client.id) as Account
      if (account) {
        account.character = undefined
        account.characterList = new ArraySchema<Character>(
          createCharacter('test', account)
        )
      }
    })

    this.onMessage('characters:select', (client, message) => {
      const account = this.state.accounts.get(client.id) as Account
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

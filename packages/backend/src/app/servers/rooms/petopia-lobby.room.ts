import { Client, LobbyRoom, Room } from 'colyseus'
import {
  ArraySchema,
  filterChildren,
  MapSchema,
  Schema,
  type,
} from '@colyseus/schema'
import { LobbyOptions } from '@colyseus/core/build/rooms/LobbyRoom'
import { Account } from '../schemas'

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
      const acc = new Account()
      acc.accountId = 1
      // client id === room.sessionId
      acc.currentClientId = client.id
      this.state.accounts.set(client.id, acc)
    })

    this.onMessage('account:register', (client, message) => {
      const acc = new Account()
      acc.accountId = 1
      // client id === room.sessionId
      acc.currentClientId = client.id
      this.state.accounts.set(client.id, acc)
    })

    this.onMessage('characters:list', (client, message) => {
      const account = this.state.accounts.get(client.id) as Account
      if (account) {
        account.character = undefined
        const character = new Character()
        character.id = 1
        character.name = 'test'
        character.level = 1
        character.map = 'starter'
        account.characterList = new ArraySchema<Character>(character)
      }
    })

    this.onMessage('characters:select', (client, message) => {
      const account = this.state.accounts.get(client.id) as Account
      if (account) {
        const character = account.characterList.find(
          (character) => character.id === message.id
        )
        account.character = character
      }
    })

    this.setState(new LobbyState())
  }

  onJoin(client: Client, options: LobbyOptions): void {}

  onLeave(client: Client): void {}
}

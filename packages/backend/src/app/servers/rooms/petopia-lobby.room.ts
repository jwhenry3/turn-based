import { Client, LobbyRoom } from 'colyseus'
import {
  ArraySchema,
  filterChildren,
  MapSchema,
  Schema,
  type,
} from '@colyseus/schema'
import { LobbyOptions } from '@colyseus/core/build/rooms/LobbyRoom'

class Character extends Schema {
  @type('number')
  id: number
  @type('string')
  name: string
  @type('number')
  level: number
  @type('string')
  map: string
}

class Account extends Schema {
  @type('number')
  accountId: number
  @type('string')
  currentClientId: string
  @type(Character)
  character: Character
  @type({ array: Character })
  characterList: ArraySchema<Character> = new ArraySchema<Character>()
}

class LobbyState extends Schema {
  @filterChildren((client, key, value: Account, root) => {
    return value.currentClientId === client.id
  })
  @type({ map: Account })
  accounts = new MapSchema<Account>()
}

export class PetopiaLobbyRoom extends LobbyRoom {
  // Life Cycle
  async onCreate(options: any): Promise<void> {
    await super.onCreate(options)
    this.onMessage('account:login', (client, message) => {
      const acc = new Account()
      acc.accountId = 1
      // client id === room.sessionId
      acc.currentClientId = client.id
      this.state.accounts.set(client.id, acc)
      // client.send('account:login:success')
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
        character.map = 'maps_starter'
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

  onJoin(client: Client, options: LobbyOptions): void {
    super.onJoin(client, options)
  }

  onLeave(client: Client): void {
    super.onLeave(client)
  }
}

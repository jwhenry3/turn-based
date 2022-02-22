import { Client, LobbyRoom } from 'colyseus'
import { filterChildren, MapSchema, Schema, type } from '@colyseus/schema'
import { LobbyOptions } from '@colyseus/core/build/rooms/LobbyRoom'

class Character extends Schema {
  @type('number')
  id: number
  @type('string')
  name: string
  @type('number')
  level: number
  @type('string')
  map:string
}

class Account extends Schema {
  @type('number')
  accountId: number
  @type('string')
  currentClientId: string
  @type(Character)
  character: Character
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
      client.send('account:login:success')
    })

    this.onMessage('account:register', (client, message) => {
      client.send('account:register:success', { id: 1 })
    })

    this.onMessage('characters:list', (client, message) => {
      client.send('characters:list:data', [{ id: 1 }])
    })

    this.onMessage('characters:select', (client, message) => {
      const character = new Character()
      character.id = 1
      character.name = 'test'
      character.level = 1
      character.map = 'maps_starter'
      const account = this.state.accounts.get(client.id) as Account
      account.character = character
      // account.triggerAll()
      client.send('characters:select:success')
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

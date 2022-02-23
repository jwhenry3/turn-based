import { Client, Room } from '@colyseus/core'
import { MapSchema, Schema, type } from '@colyseus/schema'
import { ServerGame } from '../game/server.game'
import { Character, Npc } from '../schemas'

export class PetopiaMapState extends Schema {
  @type({ map: Character })
  players = new MapSchema<Character>()

  @type({ map: Npc })
  npcs = new MapSchema<Npc>()
}

export class PetopiaMapRoom extends Room {
  maxClients: number = 64

  game: ServerGame
  created = false
  onCreate(options: any): void | Promise<any> {
    this.setState(new PetopiaMapState())
    const scene = {
      init() {},
      preload() {},
      create() {
        console.log('Created!')
        this.created = true
      },
    }
    this.game = new ServerGame(scene)
  }
  onJoin(client: Client, options?: any, auth?: any): void | Promise<any> {
    client.send('scene:created', { value: this.created })
  }
}

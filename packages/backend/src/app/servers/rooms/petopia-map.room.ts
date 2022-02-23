import { Client, Room } from '@colyseus/core'
import { MapSchema, Schema, type } from '@colyseus/schema'
import { ServerGame } from '../game/server.game'
import { createAccount } from '../generators/account'
import { createCharacter } from '../generators/character'
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
    // authenticate token and retrieve requested character to load into the map
    // handle moving from one zone to another by checking against the character's current map
    // and whether they can teleport here or zone (probably transportation method id or something)
    // not too strict on the transporting until it becomes an issue (fast travel will probably be easy to come by tbh)
    // maybe authorize if quest markers are not triggered (cant enter an instance or zone if a quest hasnt been completed)
    client.send('scene:created', { value: this.created })
    // const account = createAccount(client.sessionId, 'test')
    // const character = createCharacter('test', account)
    // this.state.players.set(character.characterId, character)
  }
  async onLeave(client: Client, consented?: boolean): Promise<any> {
    if (!consented) {
      await this.allowReconnection(client, 30)
    } else {
      this.state.players.forEach((v: Character, k) => {
        if (v.currentClientId === client.sessionId) {
          this.state.players.delete(v.characterId)
        }
      })

    }
  }
}

import { MapSchema } from '@colyseus/schema'
import { Room } from 'colyseus.js'
import { Battle } from '../../networking/schemas/Battle'
import { Character } from '../../networking/schemas/Character'
import { Npc } from '../../networking/schemas/Npc'
import { app } from '../../ui/app'

export class SceneConnector {
  attempts = 0
  timeout: any
  room: Room
  entities: { players: MapSchema<Character>; npcs: MapSchema<Npc> }
  battles: MapSchema<Battle>
  constructor(public name: string) {}

  async connect() {
    try {
      const client = app.regions[app.regionMaps[this.name]]
      this.room = await client.joinOrCreate(this.name, {
        token: app.auth.token,
        characterId: app.auth.characterId,
      })
      app.rooms.starter = this.room
      this.battles = this.room.state.battles
      this.entities = this.room.state as {
        players: MapSchema<Character>
        npcs: MapSchema<Npc>
      }

      this.room.onLeave(async (code) => {
        const reconnectCodes = [1000, 1006, 1002, 1003]
        if (reconnectCodes.includes(code)) {
          this.timeout = setTimeout(() => this.connect(), 5000)
        }
      })
    } catch (e) {
      this.timeout = setTimeout(() => this.connect(), 5000)
    }
  }

  disconnect() {
    if (typeof this.timeout !== 'undefined') {
      clearTimeout(this.timeout)
    }
    app.rooms[this.name]?.connection.close()
  }
}

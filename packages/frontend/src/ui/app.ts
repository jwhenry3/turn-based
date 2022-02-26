import { MapSchema } from '@colyseus/schema'
import { Room } from 'colyseus.js'
import { Subject } from 'rxjs'
import { Character } from '../networking/schemas/Character'
import { Npc } from '../networking/schemas/Npc'
import { MovementInput } from '../phaser/behaviors/input'
import { LobbyScene } from './scenes/lobby.scene'
import { StarterScene } from './scenes/starter.scene'

export const app = {
  game: undefined as Phaser.Game | undefined,
  movement: new MovementInput(),
  messages: {
    lobby: new Subject<{ type: string; message: any }>(),
    starter: new Subject<{ type: string; message: any }>(),
  },
  rooms: {
    lobby: undefined as Room | undefined,
    starter: undefined as Room | undefined,
  },
  scenes: {
    lobby: undefined as LobbyScene | undefined,
    starter: undefined as StarterScene | undefined,
  },
  entities: {
    players: {} as MapSchema<Character>,
    npcs: {} as MapSchema<Npc>,
  },
}

import { MapSchema } from '@colyseus/schema'
import { Client, Room } from 'colyseus.js'
import { Subject } from 'rxjs'
import { Character } from '../networking/schemas/Character'
import { Npc } from '../networking/schemas/Npc'
import { MovementInput } from '../phaser/behaviors/input'
import { LobbyScene } from '../phaser/scenes/lobby.scene'
import { StarterScene } from '../phaser/scenes/starter.scene'

export const app = {
  gameHasFocus: false,
  auth: {
    token: '',
    characterId: '',
  },
  character: undefined as Character | undefined,
  game: undefined as Phaser.Game | undefined,
  target: undefined,
  updates: new Subject<string>(),
  movement: new MovementInput(),
  messages: {
    lobby: new Subject<{ type: string; message: any }>(),
    starter: new Subject<{ type: string; message: any }>(),
  },
  regions: {
    home: new Client('ws://localhost:9201'),
  },
  regionMaps: {
    starter: 'home',
  },
  rooms: {
    active: undefined as Room | undefined,
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

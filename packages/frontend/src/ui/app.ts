import { MapSchema } from '@colyseus/schema'
import { Client, Room } from 'colyseus.js'
import { Subject } from 'rxjs'
import { BattleNpc } from '../networking/schemas/BattleNpc'
import { BattlePet } from '../networking/schemas/BattlePet'
import { BattlePlayer } from '../networking/schemas/BattlePlayer'
import { Character } from '../networking/schemas/Character'
import { Npc } from '../networking/schemas/Npc'
import { MovableEntity } from '../phaser/entities/movable'
import { LobbyScene } from '../phaser/scenes/lobby.scene'
import { StarterScene } from '../phaser/scenes/starter.scene'

export const app = {
  get gameHasFocus() {
    return app.focusedUi.length === 0
  },
  auth: {
    token: '',
    characterId: '',
  },
  focusedUi: [] as HTMLElement[],
  character: undefined as Character | undefined,
  game: undefined as Phaser.Game | undefined,
  selected: undefined as MovableEntity<any> | undefined,
  target: undefined as BattlePet | BattlePlayer | BattleNpc | undefined,
  battleEvents: new Subject<{
    event: string
    entity: BattleNpc | BattlePlayer | BattlePet
  }>(),
  updates: new Subject<string>(),
  messages: {
    lobby: new Subject<{ type: string; message: any }>(),
    starter: new Subject<{ type: string; message: any }>(),
  },
  regions: {
    home: new Client(`ws://${window.location.hostname}:9201`),
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

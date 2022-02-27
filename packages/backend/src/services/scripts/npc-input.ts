import { MapSchema } from '@colyseus/schema'
import { from, map, Subject, takeUntil } from 'rxjs'
import { NpcData } from '../rooms/fixture.models'
import { Character, Npc, PositionData } from '../schemas/schemas'
import { NpcChase } from './npc-chase'
import { NpcWander } from './npc-wander'

export class NpcInput {
  wander: NpcWander
  chase: NpcChase

  constructor(
    public npc: Npc,
    public data: NpcData,
    public movementUpdates: PositionData[]
  ) {
    this.wander = new NpcWander(npc, data, movementUpdates)
    this.chase = new NpcChase(npc, data, movementUpdates, this.wander)
    this.npc.position.speed = 3
  }

  async update() {
    this.chase.execute()
    if (this.data.canWander && !this.chase.chaseTarget) {
      this.wander.execute()
    }
  }
}

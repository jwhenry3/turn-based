import { MapSchema } from '@colyseus/schema'
import { Subject, from, takeUntil, map } from 'rxjs'
import { NpcData } from '../rooms/fixture.models'
import Npc, { Character, PositionData } from '../schemas/schemas'
import { NpcMovement } from './npc-movement'
import { NpcWander } from './npc-wander'

export class NpcFollow extends NpcMovement {
  followTarget: Character
  tick = 0
  followRadius = 48
  shouldFollow = true

  get isFOllowing() {
    return !!this.followTarget
  }

  constructor(
    public npc: Npc,
    public data: NpcData,
    public movementUpdates: PositionData[],
    public wander: NpcWander
  ) {
    super(npc, data, movementUpdates)
  }

  stopFollowing() {
    this.shouldFollow = false
    this.npc.position.speed = 3
  }
  startFollowing(target: Character) {
    this.followTarget = target
    this.npc.position.speed = 4
    this.shouldFollow = true
  }

  getMovementVector() {
    if (!this.followTarget) return
    this.moveTowards(this.followTarget.position, 48)
  }

  execute() {
    if (this.shouldFollow && this.followTarget) {
      this.moveTowards(this.followTarget.position, 48)
      this.npc.position.getNextPosition()
    }
  }
}

import { MapSchema } from '@colyseus/schema'
import { Subject, from, takeUntil, map } from 'rxjs'
import { NpcData } from '../rooms/fixture.models'
import Npc, { Character, PositionData } from '../schemas/schemas'
import { NpcMovement } from './npc-movement'
import { NpcWander } from './npc-wander'

export class NpcChase extends NpcMovement {
  chaseTarget: Character
  chaseCooldown = 10
  chaseCooldownCurrentTick = 0
  chaseTickIncrement = 10
  tick = 0

  get isChasing() {
    return !!this.chaseTarget
  }

  get chaseRange() {
    return {
      x: this.npc.position.x - this.data.chaseRadius,
      y: this.npc.position.y - this.data.chaseRadius,
      width: this.data.chaseRadius * 2,
      height: this.data.chaseRadius * 2,
    }
  }

  constructor(
    public npc: Npc,
    public data: NpcData,
    public movementUpdates: PositionData[],
    public wander: NpcWander
  ) {
    super(npc, data, movementUpdates)
  }

  async detectPlayers() {
    if (this.chaseTarget) {
      if (
        !this.isWithinRange(this.chaseTarget.position, this.data.wanderRadius)
      ) {
        this.wander.goHome()
        this.chaseTarget = null
        this.chaseCooldownCurrentTick = this.chaseCooldown
      }
    }
    if (
      !this.chaseTarget &&
      this.chaseCooldownCurrentTick <= 0 &&
      !this.wander.goingHome
    ) {
      this.npc.hash.find(this.chaseRange, (selector) => {
        if (!this.chaseTarget && selector.entity instanceof Character) {
          this.chaseTarget = selector.entity
        }
      })
    }
    if (!this.wander.goingHome && this.chaseCooldownCurrentTick > 0) {
      this.chaseCooldownCurrentTick--
    }
  }

  getMovementVector() {
    if (!this.chaseTarget) return
    this.moveTowards(this.chaseTarget.position)
  }

  execute() {
    if (this.data.isAggressive) {
      this.tick++
      if (this.tick % this.chaseTickIncrement === 0) {
        this.detectPlayers()
      }
      this.getMovementVector()
      if (this.chaseTarget) {
        this.npc.position.getNextPosition()
      }
    }
  }
}

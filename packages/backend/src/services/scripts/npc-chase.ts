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

  waitMax = 10
  waitTick = 0

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
        this.waitTick++
        if (this.waitTick > this.waitMax) {
          this.stopChase()
          this.wander.goHome()
        }
      }
    }
    if (!this.chaseTarget || this.waitTick > 0) {
      this.npc.hash.find(this.chaseRange, (selector) => {
        if (
          (!this.chaseTarget || this.waitTick > 0) &&
          selector.entity instanceof Character &&
          !selector.entity.isInBattle
        ) {
          this.chaseTarget = selector.entity
          this.npc.position.speed = 3
          this.waitTick = 0
        }
      })
    }
    if (!this.wander.goingHome && this.chaseCooldownCurrentTick > 0) {
      this.chaseCooldownCurrentTick--
    }
  }
  stopChase() {
    this.chaseTarget = null
    this.waitTick = 0
    this.npc.position.speed = 3
  }

  getMovementVector() {
    if (!this.chaseTarget) return
    this.moveTowards(this.chaseTarget.position, 32)
  }

  execute() {
    if (this.data.isAggressive) {
      this.tick++
      if (this.tick % this.chaseTickIncrement === 0) {
        this.detectPlayers()
      }
      if (this.waitTick === 0) {
        this.getMovementVector()
        if (this.chaseTarget) {
          this.npc.position.getNextPosition()
        }
      }
    }
  }
}

import { NpcInput } from '../npc-input'
import { NpcMovement } from './npc-movement'

export class NpcWander extends NpcMovement {
  wanderTick = 0
  wanderIncrement = 100
  wanderDuration = 20
  wanderStart = 0
  wandering = false

  goingHome = false

  constructor(input: NpcInput) {
    super(input)
    this.wanderIncrement = 50 + Math.random() * 50
    this.wanderDuration = Math.random() * 20
  }

  goHome() {
    this.wandering = false
    const diffX = this.data.x - this.npc.position.x
    const diffY = this.data.y - this.npc.position.y
    // give padding room so the npc doesnt have to go all the way home, just somewhere inside the wander radius
    if (
      Math.abs(diffX) > Math.round(this.data.wanderRadius / 2) ||
      Math.abs(diffY) > Math.round(this.data.wanderRadius / 2)
    ) {
      this.goingHome = true
      this.npc.position.speed = 1
      this.headTowardsOrigin()
    } else {
      this.npc.position.speed = 3
      this.stop()
      this.wandering = false
      this.goingHome = false
      this.wanderTick = 0
    }
  }

  async getMovementVector() {
    const horizontal = Math.round(Math.random() * 2) - 1
    const vertical = Math.round(Math.random() * 2) - 1
    this.npc.position.movement.horizontal = horizontal as any
    this.npc.position.movement.vertical = vertical as any
    if (horizontal !== 0 || vertical !== 0) {
      this.wandering = true
      if (!this.movementUpdates.includes(this.npc.position)) {
        this.movementUpdates.push(this.npc.position)
      }
    } else {
      this.stop()
    }
  }

  randomizeWander() {
    this.wanderIncrement = 50 + Math.random() * 100
    this.wanderDuration = 10 + Math.random() * 20
  }

  stopWander() {
    this.wanderTick = 0
    this.wandering = false
    this.stop()
  }

  wander() {
    this.wanderTick++
    if (this.wanderTick > this.wanderIncrement && !this.wandering) {
      this.getMovementVector()
    }
    if (this.wanderTick > this.wanderIncrement + this.wanderDuration) {
      this.stopWander()
      this.randomizeWander()
    }
    if (!this.goingHome && this.wandering && !this.isWithinBounds()) {
      // change direction until the next position is not out of bounds
      this.headTowardsOrigin()
    }
  }

  execute() {
    if (this.input.follow.shouldFollow && this.input.follow.followTarget) return
    if (!this.goingHome) {
      this.wander()
    } else {
      this.goHome()
    }
  }
}

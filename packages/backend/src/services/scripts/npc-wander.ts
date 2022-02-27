import { NpcData } from '../rooms/fixture.models'
import { Npc, PositionData } from '../schemas/schemas'

export class NpcWander {
  wanderTick = 0
  wanderIncrement = 100
  wanderDuration = 20
  wanderStart = 0
  wandering = false

  constructor(
    public npc: Npc,
    public data: NpcData,
    public movementUpdates: PositionData[]
  ) {
    this.wanderIncrement = 50 + Math.random() * 50
    this.wanderDuration = Math.random() * 20
  }

  isWithinBounds() {
    const diffX = Math.abs(this.data.x - this.npc.position.nextX)
    const diffY = Math.abs(this.data.y - this.npc.position.nextY)
    return (
      diffX * diffX + diffY * diffY <=
      this.data.wanderRadius * this.data.wanderRadius
    )
  }

  calculateMovement() {
    // Todo: use NpcData to determine if the npc has wandered out of it's wander radius
    // if so: rerun update to get a new movement vector
    if (this.wandering && !this.isWithinBounds()) {
      this.stopWander()
    }
  }

  getMovementVector() {
    const horizontal = Math.round(Math.random() * 2) - 1
    const vertical = Math.round(Math.random() * 2) - 1
    if (horizontal !== 0 || vertical !== 0) {
      this.wandering = true
      this.npc.position.movement.horizontal = horizontal as any
      this.npc.position.movement.vertical = vertical as any
      this.movementUpdates.push(this.npc.position)
    }
  }

  randomizeWander() {
    this.wanderIncrement = 50 + Math.random() * 100
    this.wanderDuration = 10 + Math.random() * 20
  }

  stopWander() {
    this.wandering = false
    this.npc.position.movement.horizontal = 0
    this.npc.position.movement.vertical = 0
    this.npc.position.nextX = this.npc.position.x
    this.npc.position.nextY = this.npc.position.y
    if (this.movementUpdates.includes(this.npc.position)) {
      this.movementUpdates.splice(
        this.movementUpdates.indexOf(this.npc.position),
        1
      )
    }
  }

  execute() {
    this.wanderTick++
    if (
      this.wanderTick > this.wanderIncrement &&
      !this.movementUpdates.includes(this.npc.position)
    ) {
      this.getMovementVector()
    }
    if (this.wanderTick > this.wanderIncrement + this.wanderDuration) {
      this.wanderTick = 0
      this.stopWander()
      this.randomizeWander()
    }
    if (this.wandering) {
      this.npc.position.getNextPosition()
    }
    this.calculateMovement()
  }
}

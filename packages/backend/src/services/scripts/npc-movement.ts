import { NpcData } from '../rooms/fixture.models'
import { Npc, PositionData } from '../schemas/schemas'

export class NpcMovement {
  outOfBounds = false
  constructor(
    public npc: Npc,
    public data: NpcData,
    public movementUpdates: PositionData[]
  ) {}

  moveTowards(position: { x: number; y: number }) {
    const diffX = Math.round(position.x - this.npc.position.x)
    const diffY = Math.round(position.y - this.npc.position.y)
    // give padding room so the npc doesn't layer over the player initially
    if (Math.abs(diffX) > 16 || Math.abs(diffY) > 16) {
      const horizontal = diffX > 1 ? 1 : diffX < -1 ? -1 : 0
      const vertical = diffY > 1 ? 1 : diffY < -1 ? -1 : 0
      this.npc.position.movement.horizontal = horizontal as any
      this.npc.position.movement.vertical = vertical as any
      if (!this.movementUpdates.includes(this.npc.position)) {
        this.movementUpdates.push(this.npc.position)
      }
    } else {
      this.stop()
    }
  }
  isWithinBounds() {
    const diffX = Math.abs(this.data.x - this.npc.position.nextX)
    const diffY = Math.abs(this.data.y - this.npc.position.nextY)
    this.outOfBounds = !(
      diffX * diffX + diffY * diffY <=
      this.data.wanderRadius * this.data.wanderRadius
    )
    return !this.outOfBounds
  }
  headTowardsOrigin() {
    this.moveTowards(this.data)
  }

  stop() {
    this.npc.position.nextX = this.npc.position.x
    this.npc.position.nextY = this.npc.position.y
    this.npc.position.movement.horizontal = 0
    this.npc.position.movement.vertical = 0
    if (this.movementUpdates.includes(this.npc.position)) {
      this.movementUpdates.splice(
        this.movementUpdates.indexOf(this.npc.position),
        1
      )
    }
  }
}

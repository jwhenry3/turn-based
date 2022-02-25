import { Npc, Position } from '../schemas/schemas'

export class NpcInput {
  wanderTick = 0

  wanderIncrement = 100

  wanderDuration = 20

  wanderStart = 0

  wandering = false
  constructor(public npc: Npc, public movementUpdates: Position[]) {
    this.wanderIncrement = 50 + Math.random() * 50
    this.wanderDuration = Math.random() * 20
    this.npc.position.x = Math.random() * 500
    this.npc.position.y = Math.random() * 500
  }

  update() {
    this.wanderTick++
    if (
      this.wanderTick > this.wanderIncrement &&
      !this.movementUpdates.includes(this.npc.position)
    ) {
      // wander start
      this.wandering = true
      const horizontal = Math.round(Math.random() * 2) - 1
      const vertical = Math.round(Math.random() * 2) - 1
      if (horizontal !== 0 || vertical !== 0) {
        this.npc.position.movement.horizontal = horizontal as any
        this.npc.position.movement.vertical = vertical as any
        this.movementUpdates.push(this.npc.position)
      }
    }
    if (this.wanderTick > this.wanderIncrement + this.wanderDuration) {
      this.wanderTick = 0
      this.wandering = false
      this.wanderIncrement = 50 + Math.random() * 100
      this.wanderDuration = 10 + Math.random() * 20
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
}

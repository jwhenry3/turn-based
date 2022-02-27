import { MapSchema } from '@colyseus/schema'
import { Subject, from, takeUntil, map } from 'rxjs'
import { NpcData } from '../rooms/fixture.models'
import { Character, Npc, PositionData } from '../schemas/schemas'
import { NpcWander } from './npc-wander'

export class NpcChase {
  chaseTarget: Character
  chaseCooldown = 500
  chaseCooldownCurrentTick = 0

  chaseTickIncrement = (1000 / 30) * 100

  tick = 0

  players: MapSchema<Character>

  constructor(
    public npc: Npc,
    public data: NpcData,
    public movementUpdates: PositionData[],
    public wander: NpcWander
  ) {}

  async detectPlayers() {
    const until = new Subject()
    if (this.chaseTarget) {
      if (!this.wander.isWithinBounds()) {
        this.chaseTarget = null
        this.chaseCooldownCurrentTick = this.chaseCooldown
      }
    }
    if (
      !this.chaseTarget &&
      this.chaseCooldownCurrentTick === 0 &&
      this.wander.isWithinBounds()
    ) {
      await new Promise((resolve) => {
        from(Object.keys(this.players))
          .pipe(takeUntil(until))
          .pipe(map((key) => this.players[key]))
          .subscribe({
            next: (player) => {
              if (this.isPlayerWithinSoundRadius(player)) {
                this.chaseTarget = player
                resolve(player)
              }
            },
            complete: () => resolve(undefined),
          })
      })
    }
    if (this.chaseCooldownCurrentTick > 0) {
      this.chaseCooldownCurrentTick--
    }
  }

  isPlayerWithinSoundRadius(player: Character) {
    const diffX = Math.abs(player.position.x - this.npc.position.x)
    const diffY = Math.abs(player.position.y - this.npc.position.y)
    return (
      diffX * diffX + diffY * diffY <=
      this.data.wanderRadius * this.data.wanderRadius
    )
  }

  getMovementVector() {
    if (!this.chaseTarget) return
    const diffX = this.chaseTarget.position.x - this.npc.position.x
    const diffY = this.chaseTarget.position.y - this.npc.position.y
    // give padding room so the npc doesn't layer over the player initially
    if (Math.abs(diffX) > 16 || Math.abs(diffY) > 16) {
      const horizontal = diffX > 0 ? 1 : diffX < 0 ? -1 : 0
      const vertical = diffY > 0 ? 1 : diffY < 0 ? -1 : 0
      this.npc.position.movement.horizontal = horizontal as any
      this.npc.position.movement.vertical = vertical as any
      this.movementUpdates.push(this.npc.position)
    }
  }

  execute() {
    this.tick++
    if (this.tick % this.chaseTickIncrement === 0) {
      this.detectPlayers()
    }
  }
}

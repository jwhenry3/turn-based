import { MapSchema } from '@colyseus/schema'
import { Subject, from, takeUntil, map } from 'rxjs'
import { NpcData } from '../rooms/fixture.models'
import { Character, Npc, PositionData } from '../schemas/schemas'
import { NpcMovement } from './npc-movement'
import { NpcWander } from './npc-wander'

export class NpcChase extends NpcMovement {
  chaseTarget: Character
  chaseCooldown = 10
  chaseCooldownCurrentTick = 0

  chaseTickIncrement = 10

  tick = 0

  players: MapSchema<Character>

  get isChasing() {
    return !!this.chaseTarget
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
    if (!this.players) return
    const until = new Subject()
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
      await new Promise((resolve) => {
        from(this.players.keys())
          .pipe(takeUntil(until))
          .pipe(map((key) => this.players.get(key)))
          .subscribe({
            next: (player) => {
              if (this.isWithinRange(player.position, this.data.wanderRadius)) {
                this.chaseTarget = player
                console.log('new chase target', player.name)
                resolve(player)
              }
            },
            complete: () => resolve(undefined),
          })
      })
    }
    if (!this.wander.goingHome && this.chaseCooldownCurrentTick > 0) {
      this.chaseCooldownCurrentTick--
    }
  }

  isWithinRange(position: { x: number; y: number }, radius: number) {
    if (!position || !this.npc.position) return false
    const diffX = Math.abs(position.x - this.npc.position.x)
    const diffY = Math.abs(position.y - this.npc.position.y)
    return diffX * diffX + diffY * diffY <= radius * radius
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

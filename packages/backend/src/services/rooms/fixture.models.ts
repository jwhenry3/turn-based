import { Subject, takeUntil } from 'rxjs'
import { BattleNpc } from '../schemas/battles'
import { Character } from '../schemas/schemas'

export class DropData {
  itemId?: string
  type: 'exp' | 'currency' | 'item' = 'item'
  amount: number

  constructor(data: Partial<DropData>) {
    Object.assign(this, data)
  }
}

export class NpcType {
  npcTypeId: string
  graphicsId: string
  name: string
  canWander: boolean = false
  wanderRadius: number = 0
  canPatrol: boolean = false
  patrolPath: [number, number][] = []
  isAggressive = false
  speed: number = 0
  chaseRadius: number = 0

  triggersBattle = false
  battleNpcs: BattleNpc[] = []
  maxEnemies = 0 // provided when randomize is enabled
  randomizeBattleNpcs = false

  despawnOnPlayerCollision = false

  constructor(data: Partial<NpcType>) {
    Object.assign(this, data)
    if (this.triggersBattle) {
      this.despawnOnPlayerCollision = true
    }
  }
}

export class NpcData extends NpcType {
  npcId: string
  type: NpcType
  x: number = 100
  y: number = 100

  constructor(data: Partial<NpcData>) {
    super(data)
    this.x = data.x || this.x
    this.y = data.y || this.y
  }
}

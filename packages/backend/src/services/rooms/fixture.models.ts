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
  dropData: DropData[] = []
  isAggressive = false
  speed: number = 0
  chaseRadius: number = 0

  constructor(data: Partial<NpcType>) {
    Object.assign(this, data)
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

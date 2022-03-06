import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema'
import { Character } from './schemas'
import { DropData } from '../rooms/fixture.models'
import { v4 } from 'uuid'

export class Attribute extends Schema {
  @type('number')
  baseAmount: number = 0
  @type('number')
  fromPoints: number = 0
  @type('number')
  fromEquipment: number = 0
  @type('number')
  fromBuffs: number = 0
  @type('number')
  total: number = 0

  constructor(options?: Partial<Attribute>) {
    super()
    Object.assign(this, options)
    this.total = this.baseAmount + this.fromPoints + this.fromBuffs
  }
}
export class Statistics extends Schema {
  @type('number')
  level: number = 1

  // not visible on client
  grantExpOnDeath: number = 0

  @type('number')
  currentExp: number = 0
  @type('number')
  maxExpForCurrentLevel: number = 100
  @type('number')
  availableStatPoints: number = 5

  @type('string')
  damageType: 'piercing' | 'blunt' | 'slashing' | 'magic' = 'blunt'

  @type('string')
  weaponCategory: 'melee' | 'ranged' | 'magic' = 'melee'

  @type('string')
  damageElement:
    | 'fire'
    | 'wind'
    | 'earth'
    | 'water'
    | 'ice'
    | 'light'
    | 'dark'
    | 'neutral' = 'neutral'

  @type('number')
  baseDamage: number = 1

  @type(Attribute)
  maxHp: Attribute = new Attribute({ baseAmount: 100 })
  @type(Attribute)
  hp: Attribute = new Attribute({ baseAmount: 100 })
  @type(Attribute)
  maxMp: Attribute = new Attribute({ baseAmount: 100 })
  @type(Attribute)
  mp: Attribute = new Attribute({ baseAmount: 100 })
  @type(Attribute)
  strength: Attribute = new Attribute({ baseAmount: 5 })
  @type(Attribute)
  dexterity: Attribute = new Attribute({ baseAmount: 5 })
  @type(Attribute)
  vitality: Attribute = new Attribute({ baseAmount: 5 })
  @type(Attribute)
  agility: Attribute = new Attribute({ baseAmount: 5 })
  @type(Attribute)
  intelligence: Attribute = new Attribute({ baseAmount: 5 })
  @type(Attribute)
  mind: Attribute = new Attribute({ baseAmount: 5 })
  @type(Attribute)
  charisma: Attribute = new Attribute({ baseAmount: 5 })

  constructor(options?: Partial<Statistics>) {
    super()
    Object.assign(this, options)
  }
}
export class BattlePet extends Schema {
  @type('string')
  name: string
  @type('string')
  characterId: string
  @type('string')
  petId: string
  @type('string')
  npcTypeId: string
  @type('number')
  health = 100
  @type('number')
  mana = 100

  interval = 0
  cooldown = 0
  speed = 4

  @type('boolean')
  canAct = false

  @type(Statistics)
  stats = new Statistics()

  owner: Character

  constructor(character: Character, ...args: any[]) {
    super(args)
    this.owner = character
    this.characterId = character.characterId
    this.petId = character.pet.npcId
    this.name = character.pet.name
    this.npcTypeId = character.pet.npcTypeId
  }
}
export class BattlePlayer extends Schema {
  @type('string')
  characterId: string
  @type('string')
  name: string
  @type('number')
  health = 100
  @type('number')
  mana = 100

  interval = 0

  cooldown = 0

  @type(BattlePet)
  pet: BattlePet

  speed = 4
  @type('boolean')
  canAct = false

  character: Character

  @type(Statistics)
  stats = new Statistics()

  @type({ array: 'string' })
  status: ArraySchema<string> = new ArraySchema<string>()

  @type('number')
  battleLocation = 0

  constructor(character: Character, ...args: any[]) {
    super(args)
    this.character = character
    this.characterId = character.characterId
    this.name = character.name
  }
}

export class BattleNpcType extends Schema {
  battleNpcTypeId: string

  element:
    | 'fire'
    | 'water'
    | 'earth'
    | 'wind'
    | 'ice'
    | 'light'
    | 'dark'
    | 'neutral' = 'neutral'

  health: number = 30
  level: number = 1
  expYield: number = 10
  // do not expose drop data to client
  drops: DropData[] = []
  constructor(...args: any[]) {
    super(...args)
  }
}
export class BattleNpc extends BattleNpcType {
  @type('string')
  battleNpcId: string
  @type('string')
  battleNpcTypeId: string
  @type('string')
  name: string
  @type('number')
  battleLocation = 0

  @type('string')
  element:
    | 'fire'
    | 'water'
    | 'earth'
    | 'wind'
    | 'ice'
    | 'light'
    | 'dark'
    | 'neutral' = 'neutral'

  @type('number')
  level: number = 1
  @type('number')
  expYield: number = 10

  interval = 0
  cooldown = 0

  speed = 4

  @type(Statistics)
  stats = new Statistics()

  constructor(data: Partial<BattleNpc>) {
    super(data)
    this.battleNpcId = v4()
  }
}

export class Battle extends Schema {
  @type('string')
  battleId: string

  @type('string')
  terrain: string = 'grass' // descriptor to know what battle scene to load

  @type({ map: BattlePlayer })
  players: MapSchema<BattlePlayer> = new MapSchema<BattlePlayer>()
  @type({ map: BattleNpc })
  npcs: MapSchema<BattleNpc> = new MapSchema<BattleNpc>() // configured list of BattleNpcs to load

  constructor(...args: any[]) {
    super(...args)
    this.battleId = v4()
  }
}

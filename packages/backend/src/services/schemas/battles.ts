import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema'
import { Subject, takeUntil } from 'rxjs'
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
  characterId: string
  @type('number')
  health = 100
  @type('number')
  mana = 100
  @type('number')
  cooldown = 0

  @type(Statistics)
  stats = new Statistics()

  owner: Character

  constructor(character: Character, ...args: any[]) {
    super(args)
    this.owner = character
    this.characterId = character.characterId
  }

  update(tick: number) {
    if (this.cooldown > 0) {
      this.cooldown--
    }
  }
}
export class BattlePlayer extends Schema {
  @type('string')
  characterId: string
  @type('number')
  health = 100
  @type('number')
  mana = 100

  @type('number')
  cooldown = 0

  @type(BattlePet)
  pet: BattlePet

  character: Character

  @type(Statistics)
  stats = new Statistics()

  destroy$ = new Subject<void>()
  @type({ array: 'string' })
  status: ArraySchema<string> = new ArraySchema<string>()

  @type('number')
  battleLocation = 0

  constructor(character: Character, ...args: any[]) {
    super(args)
    this.character = character
    this.characterId = character.characterId
  }

  update(tick: number) {
    if (this.cooldown > 0) {
      this.cooldown--
    }
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
  @type('number')
  cooldown = 0

  @type(Statistics)
  stats = new Statistics()

  destroy$ = new Subject<void>()

  constructor(data: Partial<BattleNpc>) {
    super(data)
    this.battleNpcId = v4()
  }

  update(tick: number) {
    if (this.cooldown > 0) {
      this.cooldown--
    }
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

  battleTick = 0
  addedPlayers: Record<number, boolean> = {}
  addedEnemies: Record<number, boolean> = {}
  positionOrder = [2, 1, 3, 4, 0, 6, 5, 7]

  update$ = new Subject<number>()
  completed$ = new Subject<void>()
  onComplete = () => null

  constructor(...args: any[]) {
    super(...args)
    this.battleId = v4()
  }

  shuffleArray(array) {
    const clone = [...array]
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[clone[i], clone[j]] = [clone[j], clone[i]]
    }
    return clone
  }
  addEnemies(
    enemyOptions: BattleNpc[],
    canRandomizeNpcOptions: boolean = false,
    maxEnemies: number = 1
  ) {
    if (canRandomizeNpcOptions) {
      let numberOfEnemies = Math.round(Math.random() * maxEnemies) + 1
      if (numberOfEnemies > maxEnemies) {
        numberOfEnemies = maxEnemies
      }
      for (let i = 0; i < numberOfEnemies; i++) {
        const index = Math.abs(
          Math.round(Math.random() * (enemyOptions.length - 1))
        )
        this.addEnemy(new BattleNpc(enemyOptions[index]))
      }
    } else {
      for (let i = 0; i < enemyOptions.length; i++) {
        this.addEnemy(enemyOptions[i])
      }
    }
  }
  watchUpdate(entity: BattlePlayer | BattleNpc) {
    this.update$
      .pipe(takeUntil(this.completed$), takeUntil(entity.destroy$))
      .subscribe((tick) => entity.update(tick))
  }

  addEnemy(option: BattleNpc) {
    const enemy = new BattleNpc(option)
    if (!enemy.battleLocation || this.addedEnemies[enemy.battleLocation]) {
      const randomized = this.shuffleArray(this.positionOrder)
      const firstAvailable = randomized.find((i) => !this.addedEnemies[i])
      enemy.battleLocation = firstAvailable
      this.addedEnemies[firstAvailable] = true
    } else {
      this.addedEnemies[enemy.battleLocation] = true
    }
    enemy.battleNpcId = v4()
    this.watchUpdate(enemy)
    this.npcs.set(enemy.battleNpcId, enemy)
  }

  addPlayer(character: Character) {
    const player = new BattlePlayer(character)
    character.isInBattle = true
    character.battleId = this.battleId
    if (character.pet) {
      const pet = new BattlePet(character)
      player.pet = pet
    }
    player.battleLocation = this.positionOrder.find(
      (i) => !this.addedPlayers[i]
    )
    this.addedPlayers[player.battleLocation] = true
    this.watchUpdate(player)
    this.players.set(character.currentClientId, player)
  }
  removePlayer(character: Character) {
    this.players[character.currentClientId]?.destroy$.next()
    character.isInBattle = false
    character.battleId = undefined
    this.addedPlayers[this.players[character.currentClientId].battleLocation] =
      false
    this.players.delete(character.currentClientId)
    if (this.players.size === 0) {
      this.complete()
    }
  }
  update() {
    this.battleTick++
    this.update$.next(this.battleTick)
  }

  complete() {
    if (this.players.size > 0) {
      this.players.forEach((player) => {
        this.removePlayer(player.character)
      })
    }
    this.completed$.next()
    this.onComplete()
  }
}

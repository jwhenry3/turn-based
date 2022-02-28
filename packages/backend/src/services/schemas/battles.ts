import { MapSchema, Schema, type } from '@colyseus/schema'
import { Subject, takeUntil } from 'rxjs'
import { Character } from './schemas'
import { DropData } from '../rooms/fixture.models'
import { v4 } from 'uuid'

export class BattlePlayer extends Schema {
  health = 100
  mana = 100

  cooldown = 0

  destroy$ = new Subject<void>()
  status: string[] = []

  constructor(public character: Character, ...args: any[]) {
    super(args)
  }

  update(tick: number) {
    if (this.cooldown > 0) {
      this.cooldown--
    }
  }
}

export class BattleNpcType extends Schema {
  @type('string')
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
  @type('number')
  battleNpcId: string

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
  health: number = 30
  @type('number')
  level: number = 1
  @type('number')
  expYield: number = 10
  @type('number')
  cooldown = 0

  destroy$ = new Subject<void>()

  constructor(data: Partial<BattleNpc>) {
    super(data)
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

  update$ = new Subject<number>()
  destroy$ = new Subject<void>()

  constructor(...args: any[]) {
    super(...args)
    this.battleId = v4()
  }
  addEnemies(
    enemyOptions: BattleNpc[],
    canRandomizeNpcOptions: boolean = false,
    maxEnemies: number = 1
  ) {
    if (canRandomizeNpcOptions) {
      const numberOfEnemies = Math.round(Math.random() * maxEnemies)
      for (let i = 0; i < numberOfEnemies; i++) {
        this.addEnemy(
          enemyOptions[Math.round(Math.random() * enemyOptions.length)]
        )
      }
    } else {
      for (let i = 0; i < enemyOptions.length; i++) {
        this.addEnemy(enemyOptions[i])
      }
    }
  }
  addEnemy(option: BattleNpc) {
    const enemy = new BattleNpc(option)
    this.update$
      .pipe(takeUntil(this.destroy$), takeUntil(enemy.destroy$))
      .subscribe((tick) => enemy.update(tick))
  }

  addPlayer(character: Character) {
    const player = new BattlePlayer(character)
    this.update$
      .pipe(takeUntil(this.destroy$), takeUntil(player.destroy$))
      .subscribe((tick) => player.update(tick))
    this.players.set(character.characterId, player)
  }
  removePlayer(character: Character) {
    this.players[character.characterId]?.destroy$.next()
    delete this.players[character.characterId]
  }
  update() {
    this.battleTick++
    this.update$.next(this.battleTick)
  }

  destroy() {
    this.destroy$.next()
  }
}

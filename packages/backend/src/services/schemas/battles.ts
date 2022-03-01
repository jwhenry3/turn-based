import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema'
import { Subject, takeUntil } from 'rxjs'
import { Character } from './schemas'
import { DropData } from '../rooms/fixture.models'
import { v4 } from 'uuid'

export class BattlePlayer extends Schema {
  @type('string')
  characterId: string
  @type('number')
  health = 100
  @type('number')
  mana = 100

  @type('number')
  cooldown = 0

  character: Character

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

  update$ = new Subject<number>()
  completed$ = new Subject<void>()
  onComplete = () => null

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
  watchUpdate(entity: BattlePlayer | BattleNpc) {
    this.update$
      .pipe(takeUntil(this.completed$), takeUntil(entity.destroy$))
      .subscribe((tick) => entity.update(tick))
  }

  addEnemy(option: BattleNpc) {
    const enemy = new BattleNpc(option)
    enemy.battleLocation = this.npcs.size
    this.watchUpdate(enemy)
    this.npcs.set(option.battleNpcId, enemy)
  }

  addPlayer(character: Character) {
    const player = new BattlePlayer(character)
    character.isInBattle = true
    character.battleId = this.battleId
    player.battleLocation = this.players.size
    this.watchUpdate(player)
    this.players.set(character.currentClientId, player)
  }
  removePlayer(character: Character) {
    this.players[character.currentClientId]?.destroy$.next()
    character.isInBattle = false
    character.battleId = undefined
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

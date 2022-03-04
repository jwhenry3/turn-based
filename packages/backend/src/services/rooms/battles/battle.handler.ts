import { Room } from 'colyseus'
import { filter, from, Subject, takeUntil } from 'rxjs'
import {
  Battle,
  BattleNpc,
  BattlePet,
  BattlePlayer,
} from '../../schemas/battles'
import { Character } from '../../schemas/schemas'
import { v4 } from 'uuid'
import { NpcLogic } from './npc.logic'

export class BattleHandler {
  battleTick = 0
  addedPlayers: Record<number, boolean> = {}
  addedEnemies: Record<number, boolean> = {}
  positionOrder = [2, 1, 3, 4, 0, 6, 5, 7]
  update$ = new Subject<number>()
  completed$ = new Subject<void>()
  onComplete = () => null

  queuedActions = []

  battleQueue: (BattleNpc | BattlePet | BattlePlayer)[] = []

  constructor(public room: Room, public battle: Battle) {}

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

  addEnemy(option: BattleNpc) {
    const enemy = new BattleNpc(option)
    if (!enemy.battleLocation || this.addedEnemies[enemy.battleLocation]) {
      const randomized = this.shuffleArray(this.positionOrder)
      const firstAvailable = randomized.find((i) => !this.addedEnemies[i])
      enemy.battleLocation = firstAvailable
      enemy.cooldown = enemy.speed * 16
      this.addedEnemies[firstAvailable] = true
      this.battleQueue.push(enemy)
      this.battleQueue.sort((a, b) => {
        return b.cooldown - a.cooldown
      })
    } else {
      this.addedEnemies[enemy.battleLocation] = true
    }
    enemy.battleNpcId = v4()
    this.battle.npcs.set(enemy.battleNpcId, enemy)
  }

  addPlayer(character: Character) {
    const player = new BattlePlayer(character)
    character.isInBattle = true
    character.battleId = this.battle.battleId
    if (character.pet) {
      const pet = new BattlePet(character)
      pet.cooldown = pet.speed * 16
      player.pet = pet
      this.battleQueue.push(pet)
    }
    player.cooldown = player.speed * 16
    player.battleLocation = this.positionOrder.find(
      (i) => !this.addedPlayers[i]
    )
    this.addedPlayers[player.battleLocation] = true
    this.battle.players.set(character.currentClientId, player)
    this.battleQueue.push(player)
    this.battleQueue.sort((a, b) => {
      return b.cooldown - a.cooldown
    })
  }
  removePlayer(character: Character) {
    this.battle.players[character.currentClientId]?.destroy$.next()
    character.isInBattle = false
    character.battleId = undefined
    this.addedPlayers[
      this.battle.players[character.currentClientId].battleLocation
    ] = false
    this.battle.players.delete(character.currentClientId)
    if (this.battle.players.size === 0) {
      this.complete()
    }
  }
  update() {
    this.battleTick++
    if (this.battleTick % 30 === 0) {
      const entity = this.battleQueue.shift()
      if (entity instanceof BattleNpc) {
        const logic = new NpcLogic(this, entity)
        logic.performAction()
        this.battleQueue.push(entity)
      } else {
        entity.canAct = true
      }
    }
    this.update$.next(this.battleTick)
  }

  complete() {
    if (this.battle.players.size > 0) {
      this.battle.players.forEach((player) => {
        this.removePlayer(player.character)
      })
    }
    this.completed$.next()
    this.onComplete()
  }
}

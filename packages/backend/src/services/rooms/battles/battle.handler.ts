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
import { PlayerLogic } from './player.logic'
import { PetLogic } from './pet.logic'

export class BattleHandler {
  battleTick = 0
  addedPlayers: Record<number, boolean> = {}
  addedEnemies: Record<number, boolean> = {}
  positionOrder = [2, 1, 3, 4, 0, 6, 5, 7]
  update$ = new Subject<number>()
  completed$ = new Subject<void>()
  onComplete = () => null

  queuedActions = []

  lastPlayerAction: Record<string, any> = {}

  npcBattleQueue: string[] = []

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
    } else {
      this.addedEnemies[enemy.battleLocation] = true
    }
    this.npcBattleQueue.push(enemy.battleNpcId)
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
      this.delayActionsFor(player.pet, () => (player.pet.canAct = true))
    }
    player.cooldown = player.speed * 16
    player.battleLocation = this.positionOrder.find(
      (i) => !this.addedPlayers[i]
    )
    this.addedPlayers[player.battleLocation] = true
    this.battle.players.set(character.currentClientId, player)
    this.delayActionsFor(player, () => (player.canAct = true))
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

  delayActionsFor(
    entity: BattlePlayer | BattlePet | BattleNpc,
    onNext = () => null
  ) {
    this.room.clock.setTimeout(
      onNext,
      1000 * entity.speed + Math.round(Math.random() * 400)
    )
  }

  onPlayerAction(character: Character, action: any) {
    const entity = this.battle.players[
      character.currentClientId
    ] as BattlePlayer
    if (entity && entity.stats.hp.total > 0) {
      entity.canAct = false
      const logic = new PlayerLogic(this, entity)
      logic.performAction(action)
      this.delayActionsFor(entity, () => {
        entity.canAct = true
      })
    }
  }

  onPetAction(character: Character, action: any) {
    const entity = this.battle.players[
      character.currentClientId
    ] as BattlePlayer
    if (entity?.pet && entity?.pet.stats.hp.total > 0) {
      entity.pet.canAct = false
      const logic = new PetLogic(this, entity.pet)
      logic.performAction(action)
      this.delayActionsFor(entity, () => {
        entity.pet.canAct = true
      })
    }
  }

  onNpcAction(id: string) {
    const entity = this.battle.npcs[id] as BattleNpc
    if (entity && entity.stats.hp.total > 0) {
      const logic = new NpcLogic(this, entity)
      logic.performAction()
      this.delayActionsFor(entity, () => {
        this.npcBattleQueue.push(id)
      })
    }
  }

  update() {
    this.battleTick++

    if (this.battleTick % 10 === 0) {
      const next = this.npcBattleQueue.shift()
      this.onNpcAction(next)
    }
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

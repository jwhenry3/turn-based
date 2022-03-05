import { Room } from 'colyseus'
import { filter, from, merge, Subject, takeUntil } from 'rxjs'
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
  async addEnemies(
    enemyOptions: BattleNpc[],
    canRandomizeNpcOptions: boolean = false,
    maxEnemies: number = 1
  ) {
    if (canRandomizeNpcOptions) {
      let numberOfEnemies = Math.round(Math.random() * maxEnemies) + 1
      if (numberOfEnemies > maxEnemies) {
        numberOfEnemies = maxEnemies
      }
      let cooldown = 2 + Math.round(Math.random() * 4)
      for (let i = 0; i < numberOfEnemies; i++) {
        const index = Math.abs(
          Math.round(Math.random() * (enemyOptions.length - 1))
        )
        const enemy = this.addEnemy(
          new BattleNpc(enemyOptions[index]),
          cooldown
        )
        cooldown += enemy.interval
      }
    } else {
      let cooldown = 2 + Math.round(Math.random() * 4)
      for (let i = 0; i < enemyOptions.length; i++) {
        const enemy = this.addEnemy(enemyOptions[i], cooldown)
        cooldown += enemy.interval
      }
    }
    this.battleQueue.sort((a, b) => b.interval - a.interval)
  }

  addEnemy(option: BattleNpc, cooldown: number) {
    const enemy = new BattleNpc(option)
    if (!enemy.battleLocation || this.addedEnemies[enemy.battleLocation]) {
      const randomized = this.shuffleArray(this.positionOrder)
      const firstAvailable = randomized.find((i) => !this.addedEnemies[i])
      enemy.battleLocation = firstAvailable
      enemy.interval = enemy.speed + Math.round(Math.random() * 4)
      enemy.cooldown = cooldown
      this.addedEnemies[firstAvailable] = true
    } else {
      this.addedEnemies[enemy.battleLocation] = true
    }
    this.battle.npcs.set(enemy.battleNpcId, enemy)
    return enemy
  }

  addPlayer(character: Character) {
    const player = new BattlePlayer(character)
    character.isInBattle = true
    character.battleId = this.battle.battleId
    player.interval = player.speed
    player.cooldown = player.interval
    player.canAct = false
    if (character.pet) {
      const pet = new BattlePet(character)
      pet.interval = player.interval + 1
      pet.cooldown = pet.interval
      pet.canAct = false
      player.pet = pet
    }
    player.battleLocation = this.positionOrder.find(
      (i) => !this.addedPlayers[i]
    )
    this.addedPlayers[player.battleLocation] = true
    this.battle.players.set(character.characterId, player)
  }
  removePlayer(character: Character) {
    this.battle.players[character.characterId]?.destroy$.next()
    character.isInBattle = false
    character.battleId = undefined
    this.addedPlayers[
      this.battle.players[character.characterId].battleLocation
    ] = false
    this.battle.players.delete(character.characterId)
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

  async onPlayerAction(character: Character, action: any) {
    const entity = this.battle.players[character.characterId] as BattlePlayer
    if (
      entity &&
      entity.canAct &&
      this.battleQueue.includes(entity) &&
      entity.stats.hp.total > 0
    ) {
      const logic = new PlayerLogic(this, entity)
      if (await logic.performAction(action)) {
        entity.canAct = false
        entity.cooldown = entity.interval
        if (this.battleQueue.includes(entity)) {
          this.battleDelay = 4
          this.battleQueue.splice(this.battleQueue.indexOf(entity), 1)
        }
      }
    }
  }

  async onPetAction(character: Character, action: any) {
    const entity = this.battle.players[character.characterId] as BattlePlayer
    if (
      entity?.pet &&
      entity.pet.canAct &&
      this.battleQueue.includes(entity.pet) &&
      entity.pet.stats.hp.total > 0
    ) {
      const logic = new PetLogic(this, entity.pet)
      if (await logic.performAction(action)) {
        entity.pet.canAct = false
        entity.pet.cooldown = entity.interval
        if (this.battleQueue.includes(entity.pet)) {
          this.battleDelay = 4
          this.battleQueue.splice(this.battleQueue.indexOf(entity.pet), 1)
        }
      }
    }
  }

  onNpcAction(id: string) {
    const entity = this.battle.npcs[id] as BattleNpc
    if (entity && entity.stats.hp.total > 0) {
      const logic = new NpcLogic(this, entity)
      logic.performAction()
      entity.cooldown = entity.interval
    }
    if (this.battleQueue.includes(entity)) {
      this.battleDelay = 4
      this.battleQueue.splice(this.battleQueue.indexOf(entity), 1)
    }
  }

  processTimings() {
    merge(
      from(this.battle.players.values()),
      from(this.battle.npcs.values())
    ).subscribe((entity: any) => {
      if (entity.stats.hp.total > 0) {
        if (entity.cooldown > 0) {
          entity.cooldown--
        } else {
          if (!this.battleQueue.includes(entity)) {
            // if ('canAct' in entity) {
            //   console.log('player can act', entity.name)
            // } else {
            //   console.log('npc can act', entity.name)
            // }
            this.battleQueue.push(entity)
          }
        }
      }
      if (entity.pet && entity.pet.stats.hp.total > 0) {
        if (entity.pet.cooldown > 0) {
          entity.pet.cooldown--
        } else {
          if (!this.battleQueue.includes(entity.pet)) {
            // console.log('pet can act', entity.pet.name)
            this.battleQueue.push(entity.pet)
          }
        }
      }
    })
  }
  battleDelay = 0
  update() {
    this.battleTick++
    // console.log('battle tick')
    this.processTimings()
    // console.log('check queue')
    if (this.battleDelay === 0) {
      if (this.battleQueue.length > 0) {
        // console.log(this.battleQueue[0].name)
        const entityToProcess = this.battleQueue[0]
        if (entityToProcess instanceof BattleNpc) {
          this.onNpcAction(entityToProcess.battleNpcId)
        } else {
          if (entityToProcess.cooldown === 0) {
            entityToProcess.canAct = true
          }
          // the battle will wait until the player has made a choice
          // for now this will be in place to allow more strategic thinking in battle
          // that way the player does not get killed while thinking of the next move
          // we could move the player to the end of the queue if they have not made a choice within time
          // to punish the player for taking too long (similar to wonderland online)
        }
      }
    } else {
      // console.log('waiting for battle delay')
      this.battleDelay--
    }
  }

  complete() {
    if (this.battle.players.size > 0) {
      this.battle.players.forEach((player) => {
        this.removePlayer(player.character)
      })
    } else {
      this.onComplete()
    }
  }
}

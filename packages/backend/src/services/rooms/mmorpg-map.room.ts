import { Client, Room } from '@colyseus/core'
import { filter, from, Subject, takeUntil } from 'rxjs'
import { CharacterModel } from '../data/character'
import { Accounts } from '../data/helpers/accounts'
import { Characters } from '../data/helpers/characters'
import { createCharacter } from '../schemas/factories/character'
import {
  Npc,
  Character,
  MmorpgMapState,
  PetNpc,
  PositionData,
} from '../schemas/schemas'
import { NpcInput } from '../scripts/npc-input'
import { NpcData } from './fixture.models'
import SpatialHash from 'spatial-hash'
import { SpatialNode } from './spacial/node'
import { Battle, BattlePlayer } from '../schemas/battles'
import { npcTypes } from './fixtures/npcs/npc-types'
import { MapConfig } from './fixtures/map.config'
import { createNpc } from '../schemas/factories/npc'
import { v4 } from 'uuid'
import { BattleHandler } from './battles/battle.handler'

export class MmorpgMapRoom extends Room {
  connectedClients: Record<string, Client> = {}
  maxClients: number = 64

  interval: any

  movementUpdates: PositionData[] = []

  created = false

  update$ = new Subject<void>()
  stopUpdates$ = new Subject<void>()
  stopPet$ = new Subject<string>()

  battleHandlers: Record<string, BattleHandler> = {}

  hash = new SpatialHash(
    {
      x: 0,
      y: 0,
      width: 4096,
      height: 4096,
    },
    16
  )

  startBattle(npcData: NpcData, player: Character) {
    const battle = new Battle()
    const handler = new BattleHandler(this, battle)
    this.battleHandlers[battle.battleId] = handler
    handler.addEnemies(
      npcData.battleNpcs,
      npcData.randomizeBattleNpcs,
      npcData.maxEnemies
    )
    handler.addPlayer(player)
    handler.onComplete = () => {
      this.battleHandlers[battle.battleId].complete()
      this.state.battles.delete(battle.battleId)
      delete this.battleHandlers[battle.battleId]
    }
    this.state.battles.set(battle.battleId, battle)
  }

  spawnNpcs(config: Partial<NpcData>[]) {
    from(config).subscribe(({ npcId, x, y }) => {
      const { npc, data } = createNpc(npcId, x, y)
      const input = new NpcInput(npc, data, this.movementUpdates, this.clock)
      npc.hash = this.hash
      this.hash.insert(npc.node)
      input.onPlayerCollide = (player: Character) => {
        if (input.data.triggersBattle) {
          this.startBattle(input.data, player)
        }
      }
      this.state.npcs.set(npc.npcId, npc)
      this.update$.pipe(takeUntil(this.stopUpdates$)).subscribe(() => {
        input.update()
      })
    })
  }

  moveTowards(position: PositionData) {
    const { x: currentX, y: currentY } = position
    const x = position.destinationX
    const y = position.destinationY
    const diffX = Math.round(x - currentX)
    const diffY = Math.round(y - currentY)
    // give padding room so the npc doesn't layer over the player initially
    // todo: soften angle for more fluid turning
    const horizontal = diffX > 8 ? 1 : diffX < -8 ? -1 : 0
    const vertical = diffY > 8 ? 1 : diffY < -8 ? -1 : 0
    if (Math.abs(diffX) < 8) {
      position.x += diffX
    }
    if (Math.abs(diffY) < 8) {
      position.y += diffY
    }
    if (horizontal !== 0 || vertical !== 0) {
      return [horizontal, vertical]
    }
    position.destinationX = undefined
    position.destinationY = undefined
    return [0, 0]
  }
  moveEntity(position: PositionData) {
    if (!isNaN(position.destinationX) && !isNaN(position.destinationY)) {
      // alter axes based on if a destination is supplied
      const [horizontal, vertical] = this.moveTowards(position)
      position.movement.horizontal = horizontal as any
      position.movement.vertical = vertical as any
    }
    if (
      position.movement.horizontal === 0 &&
      position.movement.vertical === 0
    ) {
      position.destinationX = undefined
      position.destinationY = undefined
      if (this.movementUpdates.includes(position)) {
        this.movementUpdates.splice(this.movementUpdates.indexOf(position), 1)
      }
      return
    }
    if (position?.owner?.node) {
      this.hash.update(position.owner.node)
    }
    position.getNextPosition(this.clock.deltaTime)
    if (position.nextX > 16 && position.nextY > 16) {
      position.x = position.nextX
      position.y = position.nextY
    }
  }

  setPlayerMovement(
    character: Character,
    { horizontal, vertical }: { horizontal: 1 | -1 | 0; vertical: 1 | -1 | 0 }
  ) {
    if (!character.isInBattle && (horizontal !== 0 || vertical !== 0)) {
      character.position.destinationX = undefined
      character.position.destinationY = undefined
      character.position.movement.horizontal = horizontal
      character.position.movement.vertical = vertical
      if (!this.movementUpdates.includes(character.position)) {
        this.movementUpdates.push(character.position)
      }
      return
    }
    if (this.movementUpdates.includes(character.position)) {
      character.position.movement.horizontal = 0
      character.position.movement.vertical = 0
    }
  }

  onCreate({ map }: { map: MapConfig }): void | Promise<any> {
    this.setState(new MmorpgMapState())
    this.spawnNpcs(map.npcs)
    this.clock.setInterval(() => {
      this.update$.next()
      // iterate async to avoid blocking the server
      from(this.movementUpdates).subscribe((position: PositionData) => {
        this.moveEntity(position)
      })
      from(Object.values(this.battleHandlers)).subscribe((handler) => {
        handler.update()
      })
    }, 1000 / 8)
    this.onMessage('character:move', (client, { horizontal, vertical }) => {
      const character = this.state.playersByClient.get(client.sessionId)
      if (character) {
        this.setPlayerMovement(character, { horizontal, vertical })
      }
    })
    this.onMessage('character:move:destination', (client, { x, y }) => {
      const character = this.state.playersByClient.get(client.sessionId)
      if (character) {
        character.position.destinationX = x
        character.position.destinationY = y
        if (!this.movementUpdates.includes(character.position)) {
          this.movementUpdates.push(character.position)
        }
      }
    })
    this.onMessage('chat:map', (client, { message }) => {
      const character = this.state.playersByClient.get(client.sessionId)
      if (character) {
        this.broadcast('chat:map', {
          messageId: v4(),
          type: 'player',
          character: {
            name: character.name,
            characterId: character.characterId,
          },
          message,
        })
      }
    })
    this.onMessage('character:zone', (client, { map }) => {})
    this.onMessage('character:battle:join', (client, { battleId }) => {
      const character = this.state.playersByClient.get(client.sessionId)
      if (character) {
        const battle = this.state.battles[battleId]
        if (battle) {
          if (battle.players.size >= 8) {
            client.send('character:battle:full')
            return
          }
          let hasMoved = false
          battle.players.forEach((player: BattlePlayer) => {
            if (!hasMoved) {
              character.position.x = player.character.position.x
              character.position.y = player.character.position.y
              hasMoved = true
            }
          })
          this.battleHandlers[battle.battleId].addPlayer(character)
        }
      }
    })
    this.onMessage('character:battle:leave', (client) => {
      const character = this.state.playersByClient.get(client.sessionId)
      this.state.battles[character.battleId]?.removePlayer(character)
    })
    this.onMessage('character:battle:action', (client, action) => {
      const character = this.state.playersByClient.get(client.sessionId)
      const battle = this.state.battles[character.battleId]
      if (battle && battle.players[character.currentClientId]?.canAct) {
        console.log('Player wants to perform battle action', action)
      }
    })
  }

  onDispose() {
    this.stopUpdates$.next()
  }

  async onAuth(client, options, request) {
    if (!options.characterId) {
      client.send('character id not provided')
      return
    }
    if (!options.token) {
      client.send('unauthorized')
      return
    }
    const token = await Accounts.verifyToken(options.token)
    if (!token) {
      client.send('token invalid or expired')
      return
    }
    const characterModel = await Characters.getCharacterForAccount(
      token.accountId,
      options.characterId
    )
    if (!characterModel) {
      client.send('character not found with id')
      return
    }
    const oldCharacter = this.state.players.get(characterModel.name)
    this.connectedClients[client.sessionId] = client
    if (oldCharacter) {
      if (this.state.playersByClient) {
        this.state.playersByClient.delete(oldCharacter.currentClientId)
      }
      oldCharacter.currentClientId = client.sessionId
      this.state.playersByClient.set(client.sessionId, oldCharacter)
    } else {
      const character = createCharacter(characterModel, client.sessionId)
      const node = new SpatialNode<Character>(character)
      character.position.owner = character
      character.node = node
      character.hash = this.hash
      this.hash.insert(node)
      character.position.isPlayerPosition = true
      this.addPet(character)
      this.state.players.set(character.name, character)
      this.state.playersByClient.set(client.sessionId, character)
    }
    return characterModel
  }

  addPet(character: Character) {
    const data = new NpcData({
      npcId: 'pet-1',
      ...npcTypes.npc,
      name: 'Pet',
      x: 100,
      y: 100,
    })
    const pet = new PetNpc({
      npcId: data.npcId,
      npcTypeId: data.npcTypeId,
      name: data.name,
    })
    pet.characterId = character.characterId
    character.pet = pet

    const input = new NpcInput(pet, data, this.movementUpdates, this.clock)
    input.follow.startFollowing(character)
    this.update$
      .pipe(
        takeUntil(this.stopUpdates$),
        takeUntil(
          this.stopPet$.pipe(
            filter((characterId) => characterId === character.characterId)
          )
        )
      )
      .subscribe(() => {
        input.update()
      })
  }

  removePet(character: Character) {
    if (character.pet) {
      this.stopPet$.next(character.characterId)
      character.pet = undefined
    }
  }

  async onJoin(
    client: Client,
    options?: any,
    characterModel?: CharacterModel
  ): Promise<any> {
    if (characterModel) {
      // console.log('joined!')
    }
  }

  async onLeave(client: Client, consented?: boolean): Promise<any> {
    const character = this.state.playersByClient.get(client.sessionId)
    try {
      if (consented) {
        throw new Error('consented leave')
      }
      throw new Error('disconnect no reconnect')
      // if (character) {
      //   character.status = 'reconnecting'
      // }
      // await this.allowReconnection(client, 30)
      // if (character) {
      //   character.status = 'connected'
      // }
    } catch (e) {
      if (character) {
        character.isInBattle = false
        this.stopPet$.next(character.characterId)
        this.state.battles.forEach((battle) => {
          if (battle.players[character.characterId]) {
            this.state.battles.delete(battle)
          }
        })
        character.status = 'disconnected'
        if (this.movementUpdates.includes(character.position)) {
          this.movementUpdates.splice(
            this.movementUpdates.indexOf(character.position),
            1
          )
        }
      }
      delete this.connectedClients[client.sessionId]
      this.state.players.delete(character.characterId)
      this.state.playersByClient.delete(client.sessionId)
    }
  }
}

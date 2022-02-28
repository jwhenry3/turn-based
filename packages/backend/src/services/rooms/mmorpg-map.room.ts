import { Client, Room } from '@colyseus/core'
import { filterChildren, MapSchema, Schema, type } from '@colyseus/schema'
import { from, mergeMap, Subject, takeUntil } from 'rxjs'
import { CharacterModel } from '../data/character'
import { Accounts } from '../data/helpers/accounts'
import { Characters } from '../data/helpers/characters'
import { createCharacter } from '../schemas/factories/character'
import Npc, { Character, PositionData } from '../schemas/schemas'
import { NpcInput } from '../scripts/npc-input'
import { NpcData } from './fixture.models'
import SpatialHash from 'spatial-hash'
import { SpatialNode } from './spacial/node'
import { Battle } from '../schemas/battles'

export class MmorpgMapState extends Schema {
  @type({ map: Character })
  players = new MapSchema<Character>()
  @type({ map: Character })
  playersByClient = new MapSchema<Character>()

  @type({ map: Npc })
  npcs = new MapSchema<Npc>()

  @filterChildren((client, key, battle: Battle) => {
    return battle.players?.has(client.sessionId)
  })
  @type({ map: Battle })
  battles = new MapSchema<Battle>()
}

export class MmorpgMapRoom extends Room {
  connectedClients: Record<string, Client> = {}
  maxClients: number = 64

  interval: any

  movementUpdates: PositionData[] = []

  created = false

  update$ = new Subject<void>()
  stopUpdates$ = new Subject<void>()

  hash = new SpatialHash(
    {
      x: 0,
      y: 0,
      width: 4096,
      height: 4096,
    },
    16
  )

  spawnNpcs(npcs: NpcData[]) {
    from(npcs).subscribe((data) => {
      const npc = new Npc({
        npcId: data.npcId,
        npcTypeId: data.npcTypeId,
        name: data.name,
      })
      npc.position.x = data.x
      npc.position.y = data.y
      npc.position.owner = npc
      const node = new SpatialNode(npc)
      this.hash.insert(node)
      npc.hash = this.hash
      npc.node = node
      const input = new NpcInput(npc, data, this.movementUpdates)
      input.onPlayerCollide = (player: Character) => {
        if (data.triggersBattle) {
          const battle = new Battle()
          battle.addEnemies(
            data.battleNpcs,
            data.randomizeBattleNpcs,
            data.maxEnemies
          )
          battle.addPlayer(player)
          battle.onComplete = () => {
            console.log('Battle Ended')
            this.state.battles.delete(battle.battleId)
          }
          this.state.battles.set(battle.battleId, battle)
        }
      }
      this.state.npcs.set(npc.npcId, npc)
      this.update$.pipe(takeUntil(this.stopUpdates$)).subscribe(() => {
        input.update()
      })
    })
  }
  onCreate({ npcs }: { npcs: NpcData[] }): void | Promise<any> {
    this.setState(new MmorpgMapState())
    this.spawnNpcs(npcs || [])
    this.interval = setInterval(() => {
      this.update$.next()
      // iterate async to avoid blocking the server
      from(this.movementUpdates).subscribe((position: PositionData) => {
        if (position?.owner?.node) {
          this.hash.update(position.owner.node)
        }
        if (position.isPlayerPosition) {
          position.getNextPosition()
        }
        if (position.nextX > 16 && position.nextY > 16) {
          position.x = Math.round(position.nextX)
          position.y = Math.round(position.nextY)
        }
      })
    }, 1000 / 30)
    this.onMessage('character:move', (client, { horizontal, vertical }) => {
      const character = this.state.playersByClient.get(client.sessionId)
      if (character) {
        character.position.movement.horizontal = horizontal
        character.position.movement.vertical = vertical
        if (horizontal !== 0 || vertical !== 0) {
          if (!this.movementUpdates.includes(character.position)) {
            this.movementUpdates.push(character.position)
          }
        } else {
          if (this.movementUpdates.includes(character.position)) {
            this.movementUpdates.splice(
              this.movementUpdates.indexOf(character.position),
              1
            )
          }
        }
      }
    })
    this.onMessage('character:zone', (client, { map }) => {})
    this.onMessage('character:battle', (client, { x, y }) => {})
  }

  onDispose() {
    clearInterval(this.interval)
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
      this.state.players.set(character.name, character)
      this.state.playersByClient.set(client.sessionId, character)
    }
    return characterModel
  }
  async onJoin(
    client: Client,
    options?: any,
    characterModel?: CharacterModel
  ): Promise<any> {
    if (characterModel) {
      console.log('joined!')
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
        character.status = 'disconnected'
        if (this.movementUpdates.includes(character.position)) {
          this.movementUpdates.splice(
            this.movementUpdates.indexOf(character.position),
            1
          )
        }
      }
      delete this.connectedClients[client.sessionId]
      this.state.players.forEach((v: Character, k) => {
        if (v.currentClientId === client.sessionId) {
          this.state.players.delete(v.characterId)
        }
      })
      if (this.state.playersByClient[client.sessionId]) {
        this.state.playersByClient.delete(client.sessionId)
      }
    }
  }
}

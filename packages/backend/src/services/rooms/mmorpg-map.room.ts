import { Client, Room } from '@colyseus/core'
import { MapSchema, Schema, type } from '@colyseus/schema'
import { from, Subject, takeUntil } from 'rxjs'
import { CharacterModel } from '../data/character'
import { Accounts } from '../data/helpers/accounts'
import { Characters } from '../data/helpers/characters'
import { createCharacter } from '../schemas/factories/character'
import { Character, Npc, Position } from '../schemas/schemas'
import { NpcInput } from '../scripts/npc-input'

export class MmorpgMapState extends Schema {
  @type({ map: Character })
  players = new MapSchema<Character>()
  @type({ map: Character })
  playersByClient = new MapSchema<Character>()

  @type({ map: Npc })
  npcs = new MapSchema<Npc>()
}

export class MmorpgMapRoom extends Room {
  connectedClients: Record<string, Client> = {}
  maxClients: number = 64

  interval: any

  movementUpdates: Position[] = []

  created = false

  update$ = new Subject<void>()
  stopUpdates$ = new Subject<void>()

  spawnNpcs(count: number) {
    from(Array(count).keys()).subscribe((index) => {
      const npc = new Npc({
        npcId: 'test' + index,
        npcTypeId: 'npc',
        name: 'Test NPC ' + index,
      })
      const input = new NpcInput(npc, this.movementUpdates)
      this.state.npcs.set(npc.npcId, npc)
      this.update$
        .pipe(takeUntil(this.stopUpdates$))
        .subscribe(() => input.update())
    })
  }

  onCreate(options: any): void | Promise<any> {
    this.setState(new MmorpgMapState())
    this.spawnNpcs(1000)
    this.interval = setInterval(() => {
      this.update$.next()
      // iterate async to avoid blocking the server
      from(this.movementUpdates).subscribe((position) => {
        const speed = 4
        const angle = Math.atan2(
          position.movement.vertical,
          position.movement.horizontal
        )
        const newX = Math.round(position.x + Math.cos(angle) * speed)
        const newY = Math.round(position.y + Math.sin(angle) * speed)
        if (newX > 16 && newY > 16) {
          position.x = newX
          position.y = newY
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
    console.log('auth', client.sessionId)
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

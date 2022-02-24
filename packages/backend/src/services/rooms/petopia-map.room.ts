import { Client, Room } from '@colyseus/core'
import { MapSchema, Schema, type } from '@colyseus/schema'
import { CharacterModel } from '../data/character'
import { Accounts } from '../data/helpers/accounts'
import { Characters } from '../data/helpers/characters'
import { createCharacter } from '../schemas/factories/character'
import { Character, Npc } from '../schemas/schemas'

export class PetopiaMapState extends Schema {
  @type({ map: Character })
  players = new MapSchema<Character>()
  @type({ map: Character })
  playersByClient = new MapSchema<Character>()

  @type({ map: Npc })
  npcs = new MapSchema<Npc>()
}

export class PetopiaMapRoom extends Room {
  connectedClients: Record<string, Client> = {}
  maxClients: number = 64

  created = false
  onCreate(options: any): void | Promise<any> {
    this.setState(new PetopiaMapState())
    this.onMessage('character:move', (client, { horizontal, vertical }) => {
      const character = this.state.playersByClient.get(client.sessionId)
      if (character) {
        const speed = 16
        const angle = Math.atan2(vertical, horizontal)
        const newX = Math.round(character.position.x + Math.cos(angle) * speed)
        const newY = Math.round(character.position.y + Math.sin(angle) * speed)
        character.position.x = newX
        character.position.y = newY
      }
    })
    this.onMessage('character:zone', (client, { map }) => {})
    this.onMessage('character:battle', (client, { x, y }) => {})
  }
  async onAuth(client, options, request) {
    if (!options.characterId) {
      client.send('character id not provided')
      client.close(4406)
      return
    }
    if (!options.token) {
      client.send('unauthorized')
      client.close(4401)
      return
    }
    const token = await Accounts.verifyToken(options.token)
    if (!token) {
      client.send('token invalid or expired')
      client.close(4401)
      return
    }
    const characterModel = await Characters.getCharacterForAccount(
      token.accountId,
      options.characterId
    )
    if (!characterModel) {
      client.send('character not found with id')
      client.close(4404)
      return
    }
    const oldCharacter = this.state.players.get(characterModel.name)
    if (oldCharacter) {
      const oldClient = this.connectedClients[oldCharacter.currentClientId]
      if (oldClient) {
        oldClient.send('character:conflict')
        oldClient.leave(4409)
      }
    }
    this.connectedClients[client.sessionId] = client
    const character = createCharacter(characterModel, client.sessionId)
    this.state.players.set(character.name, character)
    this.state.playersByClient.set(client.sessionId, character)
    this.state.triggerAll()
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
      if (character) {
        character.status = 'reconnecting'
      }
      await this.allowReconnection(client, 30)
      if (character) {
        character.status = 'connected'
      }
    } catch (e) {
      if (character) {
        character.status = 'disconnected'
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

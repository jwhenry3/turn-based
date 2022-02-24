import { Client, Room } from '@colyseus/core'
import { MapSchema, Schema, type } from '@colyseus/schema'
import { Accounts } from '../data/helpers/accounts'
import { Characters } from '../data/helpers/characters'
import { createCharacter } from '../schemas/factories/character'
import { Character, Npc } from '../schemas/schemas'

export class PetopiaMapState extends Schema {
  @type({ map: Character })
  players = new MapSchema<Character>()

  @type({ map: Npc })
  npcs = new MapSchema<Npc>()
}

export class PetopiaMapRoom extends Room {
  maxClients: number = 64

  created = false
  onCreate(options: any): void | Promise<any> {
    this.setState(new PetopiaMapState())
  }
  async onJoin(client: Client, options?: any, auth?: any): Promise<any> {
    // authenticate token and retrieve requested character to load into the map
    // handle moving from one zone to another by checking against the character's current map
    // and whether they can teleport here or zone (probably transportation method id or something)
    // not too strict on the transporting until it becomes an issue (fast travel will probably be easy to come by tbh)
    // maybe authorize if quest markers are not triggered (cant enter an instance or zone if a quest hasnt been completed)

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
    const character = createCharacter(characterModel, client.sessionId)
    this.state.players.set(client.sessionId, character)
  }
  async onLeave(client: Client, consented?: boolean): Promise<any> {
    if (!consented) {
      await this.allowReconnection(client, 30)
    } else {
      this.state.players.delete(client.sessionId)
    }
  }
}

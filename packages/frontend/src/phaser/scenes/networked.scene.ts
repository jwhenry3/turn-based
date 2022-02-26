import { app } from '../../ui/app'
import { NpcEntity } from '../entities/Npc'
import { PlayerEntity } from '../entities/player'
import { SceneConnector } from './scene.connector'

export class NetworkedScene extends Phaser.Scene {
  connector: SceneConnector
  name: string
  playerObjects: Record<string, PlayerEntity> = {}
  npcObjects: Record<string, NpcEntity> = {}

  async connect() {
    await this.connector.connect()
  }

  async start() {
    await this.connect()
    this.handleEntities()
    this.scene.start(this.name)
  }

  async stop() {
    this.disconnect()
    this.scene.stop(this.name)
  }

  handleEntities() {
    for (const characterId of Object.keys(
      this.connector.entities.players.toJSON()
    )) {
      const e = this.connector.entities.players[characterId]
      // console.log('player added!', e.toJSON())
      this.playerObjects[e.characterId] = new PlayerEntity(e, this)
    }
    for (const npcId of Object.keys(this.connector.entities.npcs.toJSON())) {
      const e = this.connector.entities.npcs[npcId]
      // console.log('npc added!', e.toJSON())
      this.npcObjects[e.npcId] = new NpcEntity(e, this)
    }
    this.connector.entities.players.onAdd = (e) => {
      // console.log('player added!', e.toJSON())
      this.playerObjects[e.characterId] = new PlayerEntity(e, this)
    }
    this.connector.entities.players.onRemove = (e) => {
      // console.log('player removed!', e.toJSON())
      this.playerObjects[e.characterId]?.destroy()
      delete this.playerObjects[e.characterId]
    }
    this.connector.entities.npcs.onAdd = (e) => {
      // console.log('npc added!', e.toJSON())
      this.npcObjects[e.npcId] = new NpcEntity(e, this)
    }
    this.connector.entities.npcs.onRemove = (e) => {
      // console.log('npc removed!', e.toJSON())
      this.npcObjects[e.npcId]?.destroy()
      delete this.npcObjects[e.npcId]
    }
  }

  disconnect() {
    this.connector.disconnect()
  }

  handleInput() {
    app.movement.update(this.input)
  }
}

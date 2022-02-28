import { app } from '../../ui/app'
import { NpcEntity } from '../entities/Npc'
import { PlayerEntity } from '../entities/player'
import { BattleScene } from './battle.scene'
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
      this.add.existing(this.playerObjects[e.characterId])
    }
    for (const npcId of Object.keys(this.connector.entities.npcs.toJSON())) {
      const e = this.connector.entities.npcs[npcId]
      this.npcObjects[e.npcId] = new NpcEntity(e, this)
      this.add.existing(this.npcObjects[e.npcId])
    }
    this.connector.entities.players.onAdd = (e) => {
      // console.log('player added!', e.toJSON())
      this.playerObjects[e.characterId] = new PlayerEntity(e, this)
      this.add.existing(this.playerObjects[e.characterId])
    }
    this.connector.entities.players.onRemove = (e) => {
      // console.log('player removed!', e.toJSON())
      this.playerObjects[e.characterId]?.destroy()
      delete this.playerObjects[e.characterId]
    }
    this.connector.entities.npcs.onAdd = (e) => {
      this.npcObjects[e.npcId] = new NpcEntity(e, this)
      this.add.existing(this.npcObjects[e.npcId])
    }
    this.connector.entities.npcs.onRemove = (e) => {
      console.log('npc removed!', e.toJSON())
      this.npcObjects[e.npcId]?.destroy()
      delete this.npcObjects[e.npcId]
    }

    this.connector.battles.onAdd = (e) => {
      console.log('added battle', e.toJSON())
      const battleScene = this.game.scene.add(
        'battle',
        BattleScene
      ) as BattleScene
      battleScene.battle = e
      this.game.scene.start('battle')
    }
    this.connector.battles.onRemove = (e) => {
      console.log('removed battle', e.toJSON())
      this.game.scene.stop('battle')
    }
  }

  disconnect() {
    this.connector.disconnect()
  }
}

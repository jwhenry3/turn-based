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

  destinationPointer: Phaser.GameObjects.Arc

  async connect() {
    await this.connector.connect()
  }

  create() {
    this.destinationPointer = this.add.arc(
      0,
      0,
      8,
      0,
      360,
      false,
      Phaser.Display.Color.HexStringToColor('#55f').color,
      0.2
    )
    this.destinationPointer.setVisible(false)
  }

  async start() {
    await this.connect()
    this.handleEntities()
    this.scene.start(this.name)
  }

  async stop() {
    this.disconnect()
    this.scene.stop(this.name)
    this.playerObjects = {}
    this.npcObjects = {}
  }

  handleEntities() {
    for (const characterId of Object.keys(
      this.connector.entities.players.toJSON()
    )) {
      const e = this.connector.entities.players[characterId]
      this.playerObjects[e.characterId] = new PlayerEntity(e, this)
      this.add.existing(this.playerObjects[e.characterId])
    }
    for (const npcId of Object.keys(this.connector.entities.npcs.toJSON())) {
      const e = this.connector.entities.npcs[npcId]
      this.npcObjects[e.npcId] = new NpcEntity(e, this)
      this.add.existing(this.npcObjects[e.npcId])
    }
    this.connector.entities.players.onAdd = (e) => {
      console.log('added', e)
      this.playerObjects[e.characterId] = new PlayerEntity(e, this)
      this.add.existing(this.playerObjects[e.characterId])
    }
    this.connector.entities.players.onChange = (e) => {
      console.log('changed', e)
      this.playerObjects[e.characterId].model = e
    }
    this.connector.entities.players.onRemove = (e) => {
      console.log('removed', e)
      this.playerObjects[e.characterId]?.destroy()
      delete this.playerObjects[e.characterId]
    }
    this.connector.entities.npcs.onAdd = (e) => {
      this.npcObjects[e.npcId] = new NpcEntity(e, this)
      this.add.existing(this.npcObjects[e.npcId])
    }
    this.connector.entities.npcs.onRemove = (e) => {
      this.npcObjects[e.npcId]?.destroy()
      delete this.npcObjects[e.npcId]
    }

    this.connector.battles.onAdd = (b) => {
      b.players.onAdd = (p) => {
        let battleScene = this.game.scene.getScene('battle') as BattleScene
        if (p.characterId === app.auth.characterId) {
          if (!battleScene) {
            battleScene = this.game.scene.add(
              'battle',
              BattleScene
            ) as BattleScene
          }
          battleScene.playerEntities = this.playerObjects
          battleScene.addPlayer(p)
          battleScene.connector = this.connector
          battleScene.battle = b
          this.game.scene.start('battle')
          b.players.onRemove = (p) => {
            if (p.characterId === app.auth.characterId) {
              this.game.scene.stop('battle')
              this.cameras.main.setZoom(1)
            } else {
              battleScene.removePlayer(p)
            }
          }
          return
        }
        if (battleScene?.battle.battleId === b.battleId) {
          battleScene.addPlayer(p)
        }
      }
    }
    this.connector.battles.onChange = (e) => {
      console.log(e)
    }
    this.connector.battles.onRemove = (e) => {
      let battleScene = this.game.scene.getScene('battle') as BattleScene
      if (battleScene?.battle.battleId !== e.battleId) return
      this.game.scene.stop('battle')
      this.cameras.main.setZoom(1)
    }
  }

  update() {
    if (app.movement.mouseDestination) {
      this.destinationPointer.setPosition(
        app.movement.mouseDestination.x,
        app.movement.mouseDestination.y
      )
      this.destinationPointer.setVisible(true)
    } else {
      this.destinationPointer.setVisible(false)
    }
  }

  disconnect() {
    this.connector.disconnect()
  }
}

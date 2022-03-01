import { MapSchema } from '@colyseus/schema'
import { Battle } from '../../networking/schemas/Battle'
import { BattleScenePlayer } from '../entities/battle/battle-player'
import { PlayerEntity } from '../entities/player'
import { SceneConnector } from './scene.connector'

export class BattleScene extends Phaser.Scene {
  battle: Battle
  connector: SceneConnector

  rectangle: Phaser.GameObjects.Rectangle

  players: Record<string, BattleScenePlayer> = {}
  playerEntities: Record<string, PlayerEntity> = {}

  width = 1024
  lastWidth = this.width
  height = 600

  battleLocations = {
    players: [
      [200, 200],
      [300, 300],
      [400, 200],
      [500, 300],
    ],
  }

  create() {
    this.cameras.main.transparent = false
    this.cameras.main.setBackgroundColor('#000')
    this.rectangle = this.add.rectangle(
      this.width / 2,
      this.height / 2,
      this.width,
      this.height,
      Phaser.Display.Color.HexStringToColor('#00aa22').color
    )
    const focus = this.add.rectangle(
      this.width / 2,
      this.height / 2,
      1,
      1,
      Phaser.Display.Color.HexStringToColor('#00f').color
    )
    this.cameras.main.startFollow(focus)
    this.cameras.main.setZoom(window.innerWidth / 1024)
    this.battle.players.forEach((player) => {
      this.addPlayer(player)
    })
  }
  addPlayer(player) {
    this.players[player.characterId] = new BattleScenePlayer(
      player,
      this,
      this.connector
    )
    player.character = this.playerEntities[player.characterId].model
    this.add.existing(this.players[player.characterId])
  }
  removePlayer(player) {
    this.players[player.characterId].destroy()
    delete this.players[player.characterId]
  }
  update() {
    if (window.innerWidth !== this.lastWidth) {
      this.cameras.main.setZoom(window.innerWidth / this.width)
      this.lastWidth = window.innerWidth
    }
  }
}

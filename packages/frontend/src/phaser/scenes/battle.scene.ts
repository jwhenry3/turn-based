import { MapSchema } from '@colyseus/schema'
import { Battle } from '../../networking/schemas/Battle'
import { BattleNpc } from '../../networking/schemas/BattleNpc'
import { BattleSceneEnemy } from '../entities/battle/battle-enemy'
import { BattleScenePlayer } from '../entities/battle/battle-player'
import { PlayerEntity } from '../entities/player'
import { SceneConnector } from './scene.connector'

export class BattleScene extends Phaser.Scene {
  battle: Battle
  connector: SceneConnector

  rectangle: Phaser.GameObjects.Rectangle

  players: Record<string, BattleScenePlayer> = {}
  enemies: Record<string, BattleSceneEnemy> = {}
  playerEntities: Record<string, PlayerEntity> = {}

  width = 1024
  lastWidth = this.width
  height = 600

  battleLocations = {
    players: [
      [120, 400],
      [180, 450],
      [240, 500],
      [300, 550],
    ],

    enemies: [
      [this.width - 120, this.height - 400],
      [this.width - 180, this.height - 450],
      [this.width - 240, this.height - 500],
      [this.width - 300, this.height - 550],
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
    this.battle.npcs.forEach((npc) => {
      this.addEnemy(npc)
    })
  }
  addPlayer(player) {
    this.players[player.characterId] = new BattleScenePlayer(
      player,
      this,
      this.connector
    )
    this.players[player.characterId].character =
      this.playerEntities[player.characterId].model
    this.add.existing(this.players[player.characterId])
  }
  addEnemy(enemy: BattleNpc) {
    this.enemies[enemy.battleNpcId] = new BattleSceneEnemy(
      enemy,
      this,
      this.connector
    )
    this.add.existing(this.enemies[enemy.battleNpcId])
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

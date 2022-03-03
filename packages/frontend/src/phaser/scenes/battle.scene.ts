import { MapSchema } from '@colyseus/schema'
import { Battle } from '../../networking/schemas/Battle'
import { BattleNpc } from '../../networking/schemas/BattleNpc'
import { BattlePlayer } from '../../networking/schemas/BattlePlayer'
import { Character } from '../../networking/schemas/Character'
import { BattleSceneEnemy } from '../entities/battle/battle-enemy'
import { BattleScenePet } from '../entities/battle/battle-pet'
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

  width = 1100
  lastWidth = this.width
  height = 600
  battleLocations = {
    players: [],

    enemies: [],
  }

  rows = [
    [-2, -1, 0, 1, 2],
    [-1.5, 0, 1.5],
  ]
  leftMin = 0
  gridSize = 64
  spaceBetween = 32
  center = this.height / 2
  verticalOffset = 64

  image: Phaser.GameObjects.Image

  createPositions() {
    const playerPositions = []
    const npcPositions = []
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i]
      for (let j = 0; j < row.length; j++) {
        const value = row[j]
        const x =
          this.leftMin +
          ((i + j) % 2 === 0 ? 16 : -16) +
          (this.gridSize + this.spaceBetween * 2.5) * (this.rows.length - i)
        const y =
          this.center + this.verticalOffset -
          (this.gridSize + this.spaceBetween * ((1 - i) * 0.75)) * value
        playerPositions.push([x + j * -8, y])
        npcPositions.push([this.width - x - j * 8, y])
      }
    }
    return {
      players: playerPositions,
      enemies: npcPositions,
    }
  }

  preload() {
    this.load.image('battle-overlay', '/battle.png')
    this.battleLocations = this.createPositions()
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
    this.image = this.add.image(
      this.width / 2,
      this.height / 2,
      'battle-overlay'
    )

    const focus = this.add.rectangle(
      this.width / 2,
      this.height / 2,
      1,
      1,
      Phaser.Display.Color.HexStringToColor('#00f').color
    )
    this.cameras.main.startFollow(focus)
    this.zoom()
    this.battle.players.forEach((player) => {
      this.addPlayer(player)
    })
    this.battle.npcs.forEach((npc) => {
      this.addEnemy(npc)
    })
    // placeholders for debug
    for (const [x, y] of this.battleLocations.players) {
      const rect1 = this.add.rectangle(
        x,
        y,
        24,
        24,
        Phaser.Display.Color.HexStringToColor('#00f').color,
        0.2
      )
      const rect2 = this.add.rectangle(
        x - 64,
        y + 16,
        24,
        24,
        Phaser.Display.Color.HexStringToColor('#3af').color,
        0.2
      )
      rect1.setOrigin(0.5, 0.75)
      rect2.setOrigin(0.5, 0.75)
    }
    for (const [x, y] of this.battleLocations.enemies) {
      const rect1 = this.add.rectangle(
        x,
        y,
        24,
        24,
        Phaser.Display.Color.HexStringToColor('#f00').color,
        0.2
      )
      rect1.setOrigin(0.5, 0.75)
    }
  }

  addPlayer(player: BattlePlayer) {
    if (this.players[player.characterId]) return
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
    if (this.enemies[enemy.battleNpcId]) return
    this.enemies[enemy.battleNpcId] = new BattleSceneEnemy(
      enemy,
      this,
      this.connector
    )
    this.add.existing(this.enemies[enemy.battleNpcId])
  }
  removePlayer(player) {
    if (!this.players[player.characterId]) return
    // console.log('destroy', player.name)
    this.players[player.characterId].destroy()
    delete this.players[player.characterId]
  }
  update() {
    if (window.innerWidth !== this.lastWidth) {
      this.zoom()
    }
  }
  zoom() {
    const zoom = window.innerWidth / this.width
    const zoom1 = window.innerHeight / (this.height * 1.2)
    this.cameras.main.setZoom(
      zoom > zoom1 ? (zoom1 > 1 ? 1 : zoom1) : zoom > 1 ? 1 : zoom
    )
  }

  stop() {
    for (const id in this.players) {
      this.players[id].destroy()
    }
    for (const id in this.enemies) {
      this.enemies[id].destroy()
    }
    this.players = {}
    this.enemies = {}
    this.playerEntities = {}
  }
}

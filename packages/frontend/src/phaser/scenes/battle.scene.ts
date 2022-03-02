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

  width = 800
  lastWidth = this.width
  height = 600
  battleLocations = {
    players: [],

    enemies: [],
  }

  positionOrder = [1, 2, 3, 0, 4, 5, 6, 7]

  createPositions() {
    const playerPositions = []
    const npcPositions = []
    for (let i = 0; i < 8; i++) {
      let baseX = 108 + (i - 5) * 64
      let baseY = 360 + (i - 5) * 64
      if (i < 5) {
        baseX = 108 + 64 + i * 64
        baseY = 236 + i * 64
      }
      playerPositions.push([baseX, baseY])
      npcPositions.push([this.width - baseX + 64, this.height - baseY])
    }
    this.battleLocations.players = playerPositions
    this.battleLocations.enemies = npcPositions
  }

  create() {
    this.createPositions()
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
        32,
        64,
        Phaser.Display.Color.HexStringToColor('#00f').color,
        0.5
      )
      const rect2 = this.add.rectangle(
        x - 64,
        y,
        32,
        64,
        Phaser.Display.Color.HexStringToColor('#3af').color,
        0.5
      )
      rect1.setOrigin(0.5, 0.75)
      rect2.setOrigin(0.5, 0.75)
    }
    for (const [x, y] of this.battleLocations.enemies) {
      const rect1 = this.add.rectangle(
        x,
        y,
        32,
        64,
        Phaser.Display.Color.HexStringToColor('#f00').color
      )
      rect1.setOrigin(0.5, 0.75)
    }
  }

  addPlayer(player: BattlePlayer) {
    this.players[player.characterId] = new BattleScenePlayer(
      player,
      this,
      this.connector
    )
    this.players[player.characterId].character =
      this.playerEntities[player.characterId].model
    this.add.existing(this.players[player.characterId])
    if (player.pet) {
      this.players[player.characterId].pet = new BattleScenePet(
        player.pet,
        this,
        this.connector
      )
      this.players[player.characterId].pet.owner =
        this.players[player.characterId]
      this.add.existing(this.players[player.characterId].pet)
    }
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
}

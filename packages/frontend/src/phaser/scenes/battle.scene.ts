import { MapSchema } from '@colyseus/schema'
import { Battle } from '../../networking/schemas/Battle'
import { BattleNpc } from '../../networking/schemas/BattleNpc'
import { BattlePlayer } from '../../networking/schemas/BattlePlayer'
import { Character } from '../../networking/schemas/Character'
import { app } from '../../ui/app'
import { BattleSceneEnemy } from '../entities/battle/battle-enemy'
import { BattleEntity } from '../entities/battle/battle-entity'
import { BattleScenePet } from '../entities/battle/battle-pet'
import { BattleScenePlayer } from '../entities/battle/battle-player'
import { BattlePosition } from '../entities/battle/battle-position'
import { BattleQueuedAttack } from '../entities/battle/battle-queued-attack'
import { PlayerEntity } from '../entities/player'
import { SceneConnector } from './scene.connector'

export class BattleScene extends Phaser.Scene {
  battle: Battle
  connector: SceneConnector

  rectangle: Phaser.GameObjects.Rectangle

  players: Record<string, BattleScenePlayer> = {}
  enemies: Record<string, BattleSceneEnemy> = {}
  playerEntities: Record<string, PlayerEntity> = {}

  localPlayer: BattleScenePlayer

  width = 1100
  lastWidth = this.width
  height = 600

  rows = [
    [-2, -1, 0, 1, 2],
    [-2, -1, 0, 1, 2],
  ]

  leftPositions: BattlePosition[] = []
  rightPositions: BattlePosition[] = []
  leftMin = 0
  gridSize = 64
  spaceBetween = 32
  center = this.height / 2
  verticalOffset = 64

  image: Phaser.GameObjects.Image
  lastIsMobilePortrait = false

  onLocalPlayerAdded = () => null

  isMobilePortrait() {
    return window.innerWidth < 550
  }

  createOrUpdatePositions() {
    let offsetIncrement = 4
    let horizontalSpaceBetween = this.spaceBetween * 2.5
    this.leftMin = 0
    if (this.isMobilePortrait()) {
      this.leftMin = this.width / 4.2
      offsetIncrement = 4
      horizontalSpaceBetween = this.spaceBetween
    }

    let index = 0
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i]
      let offset = 0
      for (let j = 0; j < row.length; j++) {
        const value = row[j]
        const x =
          this.leftMin +
          offset +
          // ((i + j) % 2 === 0 ? 16 : -16) +
          (this.gridSize + horizontalSpaceBetween) * (this.rows.length - i)
        const y =
          this.center +
          this.verticalOffset -
          (this.gridSize + (this.spaceBetween / 8) * ((1 - i) * 0.75)) * value
        offset += offsetIncrement
        let container = this.leftPositions[index]
        let container2 = this.rightPositions[index]
        if (!this.leftPositions[index]) {
          container = new BattlePosition(this, x + j * 4, y)
          container2 = new BattlePosition(this, this.width + 32 - x - j * 4, y)
          this.add.existing(container)
          this.add.existing(container2)
          this.leftPositions.push(container)
          this.rightPositions.push(container2)
        }
        container.originalX = x + j * 4
        container.originalY = y
        container2.originalX = this.width + 32 - x - j * 4
        container2.originalY = y
        container.setPosition(x + j * 4, y)
        container.setDepth(container.y)
        container2.setPosition(this.width + 32 - x - j * 4, y)
        container2.setDepth(container2.y)
        index++
      }
    }
    for (const id in this.players) {
      if (this.players[id].pet) {
        const position = this.players[id].petPosition
        if (this.isMobilePortrait()) {
          if (
            position &&
            this.players[id]?.parentContainer?.originalX &&
            this.players[id].parentContainer
          ) {
            position.originalX = this.players[id].parentContainer.originalX - 40
            position.setPosition(position.originalX, position.originalY)
          }
        } else {
          if (
            position &&
            this.players[id]?.parentContainer?.originalX &&
            this.players[id].parentContainer
          ) {
            position.originalX = this.players[id].parentContainer.originalX - 64
            position.setPosition(position.originalX, position.originalY)
          }
        }
      }
    }
  }

  preload() {
    this.load.image('battle-overlay', '/battle.png')
    this.createOrUpdatePositions()
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
  }

  addPlayer(player: BattlePlayer) {
    if (this.players[player.characterId]) return
    this.players[player.characterId] = new BattleScenePlayer(
      this.playerEntities[player.characterId].model,
      player,
      this,
      this.connector
    )
    this.add.existing(this.players[player.characterId])
    this.players[player.characterId]
      .getBattleLocation()
      .add(this.players[player.characterId])
    if (player.characterId === app.character.characterId) {
      this.localPlayer = this.players[player.characterId]
      this.onLocalPlayerAdded()
    }
  }
  addEnemy(enemy: BattleNpc) {
    if (this.enemies[enemy.battleNpcId]) return
    this.enemies[enemy.battleNpcId] = new BattleSceneEnemy(
      enemy,
      this,
      this.connector
    )
    this.enemies[enemy.battleNpcId].facing = 'left'
    this.add.existing(this.enemies[enemy.battleNpcId])
    this.enemies[enemy.battleNpcId]
      .getBattleLocation()
      .add(this.enemies[enemy.battleNpcId])
  }
  removePlayer(player) {
    if (!this.players[player.characterId]) return
    // console.log('destroy', player.name)
    this.players[player.characterId].destroy()
    delete this.players[player.characterId]
  }
  isAttacking = 0
  fightIndex = 0

  queuedAttacks: BattleQueuedAttack[] = []

  update() {
    if (window.innerWidth !== this.lastWidth) {
      this.zoom()
      app.updates.next('battle:size')
    }

    if (this.queuedAttacks.length > 0) {
      for (const attack of this.queuedAttacks) {
        attack.update()
      }
    }
  }
  zoom() {
    const zoom = window.innerWidth / this.width
    const zoom1 = window.innerHeight / this.height
    const modifier = this.isMobilePortrait() ? 2 : 1
    this.cameras.main.setZoom((zoom > zoom1 ? zoom1 : zoom) * modifier)
    const currentMobilePortrait = this.isMobilePortrait()
    if (this.lastIsMobilePortrait !== currentMobilePortrait) {
      this.lastIsMobilePortrait = currentMobilePortrait
      this.createOrUpdatePositions()
    }
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

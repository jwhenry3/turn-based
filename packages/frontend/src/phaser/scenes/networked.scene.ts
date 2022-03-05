import { Character } from '../../networking/schemas/Character'
import { app } from '../../ui/app'
import {
  ChatMessage,
  useChatHistoryState,
} from '../../ui/world/hud/chat/use-chat-history'
import { BattleQueuedAttack } from '../entities/battle/battle-queued-attack'
import { NpcEntity } from '../entities/Npc'
import { PlayerEntity } from '../entities/player'
import { useBattle } from '../use-battle'
import { BattleScene } from './battle.scene'
import { SceneConnector } from './scene.connector'

export class NetworkedScene extends Phaser.Scene {
  connector: SceneConnector
  name: string
  playerObjects: Record<string, PlayerEntity> = {}
  npcObjects: Record<string, NpcEntity> = {}

  destinationPointer: Phaser.GameObjects.Arc
  ground: Phaser.GameObjects.Rectangle

  localPlayer: PlayerEntity

  width = 2056
  height = 2056

  async connect() {
    await this.connector.connect()
  }

  create() {
    this.ground = this.add.rectangle(
      this.width / 2,
      this.height / 2,
      this.width,
      this.height,
      Phaser.Display.Color.HexStringToColor('#00aa66').color
    )
    this.ground.setDepth(-100)
    this.ground.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
      Phaser.Geom.Rectangle.Contains
    )
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
    this.connector.room.onMessage('battle:action', (action) => {
      const battle = useBattle.getState().battle
      if (battle?.battle.battleId === action.battleId) {
        // console.log('Received action', action)
        let attacker: any = null
        let target: any = null
        if (action.entity.battleNpcId) {
          attacker = battle?.enemies[action.entity.battleNpcId]
        } else if (action.entity.petId) {
          attacker = battle?.players[action.entity.characterId].pet
        } else {
          attacker = battle?.players[action.entity.characterId]
        }
        if (action.target.battleNpcId) {
          target = battle?.enemies[action.target.battleNpcId]
        } else if (action.target.petId) {
          target = battle?.players[action.target.characterId].pet
        } else {
          target = battle?.players[action.target.characterId]
        }

        if (attacker && target) {
          const attack = new BattleQueuedAttack(
            battle,
            attacker,
            target,
            action.duration,
            action.abilityId
          )
          attack.onComplete = () =>
            battle.queuedAttacks.splice(battle.queuedAttacks.indexOf(attack), 1)
          battle.queuedAttacks.push(attack)
        } else {
          console.warn('enemy not found for action', action)
        }
      }
    })
  }

  async start() {
    await this.connect()
    app.rooms.active = this.connector.room
    this.handleEntities()
    this.scene.start(this.name)
  }

  stop() {
    if (app.rooms.active === this.connector.room) {
      app.rooms.active = undefined
    }
    this.scene.stop('battle')
    this.disconnect()
    this.scene.stop(this.name)
    this.playerObjects = {}
    this.npcObjects = {}
  }

  handleEntities() {
    this.connector.room.onMessage('chat:map', (message: ChatMessage) => {
      useChatHistoryState.getState().addMessage(message)
    })
    if (this.connector.entities?.players) {
      for (const characterId of Object.keys(
        this.connector.entities.players.toJSON()
      )) {
        const e = this.connector.entities.players[characterId]
        this.playerObjects[e.characterId] = new PlayerEntity(e, this)
        if (this.playerObjects[e.characterId].isLocalPlayer) {
          this.localPlayer = this.playerObjects[e.characterId]
        }
        this.add.existing(this.playerObjects[e.characterId])
      }

      this.connector.entities.players.onAdd = (e) => {
        // console.log('added', e)
        this.playerObjects[e.characterId] = new PlayerEntity(e, this)
        this.add.existing(this.playerObjects[e.characterId])
        if (this.playerObjects[e.characterId].isLocalPlayer) {
          this.localPlayer = this.playerObjects[e.characterId]
        }
      }
      this.connector.entities.players.onChange = (e) => {
        // console.log('changed', e)
        this.playerObjects[e.characterId].model = e
      }
      this.connector.entities.players.onRemove = (e) => {
        // console.log('removed', e)
        this.playerObjects[e.characterId]?.destroy()
        if (this.localPlayer === this.playerObjects[e.characterId]) {
          this.localPlayer = undefined
        }
        delete this.playerObjects[e.characterId]
      }
    }
    if (this.connector.entities?.npcs) {
      for (const npcId of Object.keys(this.connector.entities.npcs.toJSON())) {
        const e = this.connector.entities.npcs[npcId]
        this.npcObjects[e.npcId] = new NpcEntity(e, this)
        this.add.existing(this.npcObjects[e.npcId])
      }
      this.connector.entities.npcs.onAdd = (e) => {
        this.npcObjects[e.npcId] = new NpcEntity(e, this)
        this.add.existing(this.npcObjects[e.npcId])
      }
      this.connector.entities.npcs.onRemove = (e) => {
        this.npcObjects[e.npcId]?.destroy()
        delete this.npcObjects[e.npcId]
      }
    }
    if (this.connector.battles) {
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
            this.game.scene.start('battle')
            useBattle.getState().update(battleScene)
            battleScene.playerEntities = this.playerObjects
            battleScene.addPlayer(p)
            battleScene.connector = this.connector
            battleScene.battle = b
            battleScene.battle.players.forEach((player) => {
              // console.log('adding player')
              battleScene.addPlayer(player)
            })
            battleScene.battle.npcs.forEach((npc) => {
              // console.log('adding enemy')
              battleScene.addEnemy(npc)
            })
            b.players.onRemove = (p) => {
              if (p.characterId === app.auth.characterId) {
                this.game.scene.stop('battle')
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

      this.connector.battles.onRemove = (e) => {
        let battleScene = this.game.scene.getScene('battle') as BattleScene
        if (battleScene?.battle.battleId !== e.battleId) return
        useBattle.getState().update(undefined)
        battleScene.stop()
        this.game.scene.stop('battle')
      }
    }
  }

  update() {
    const zoom1 = window.innerWidth / 600
    const zoom2 = window.innerHeight / 600
    const zoom = zoom1 < zoom2 ? zoom1 : zoom2
    // adjust zoom to properly scope the area around the player to make it consistent across devices
    this.cameras.main.setZoom(zoom < 0.5 ? 0.5 : zoom)
    app.updates.next('map:update')
  }

  disconnect() {
    this.connector.disconnect()
  }
}

import { app } from '../../ui/app'
import { NetworkedScene } from './networked.scene'
import { SceneConnector } from './scene.connector'

export class StarterScene extends NetworkedScene {
  attempts = 0
  timeout: any

  connector = new SceneConnector('starter')

  create() {
    this.connector.entities.players.onChange = (e) => {
      console.log('players changed', e)
    }
    this.connector.entities.npcs.onChange = (e) => {
      console.log('npcs changed', e)
    }
  }

  update() {
    app.movement.update(this.input)
  }
}

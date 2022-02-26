import { app } from '../app'

export class StarterScene extends Phaser.Scene {
  create() {
    console.log('create', app.entities)
    app.entities.players.onChange = (e) => {
      console.log('players changed', e)
    }
    app.entities.npcs.onChange = (e) => {
      console.log('npcs changed', e)
    }
  }

  update() {
    app.movement.update(this.input)
  }
}

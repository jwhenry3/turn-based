import { BattleEntity } from './battle-entity'

export class BattlePosition extends Phaser.GameObjects.Container {
  originalX = 0
  originalY = 0

  get entity() {
    return this.getAt(0) as BattleEntity<any>
  }
}

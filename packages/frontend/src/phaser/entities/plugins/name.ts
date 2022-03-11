import { BattleEntity } from '../battle/battle-entity'
import { MovableEntity } from '../movable'

export class NamePlugin {
  gameObject: Phaser.GameObjects.Text
  constructor(
    public scene: Phaser.Scene,
    public owner: MovableEntity<any> | BattleEntity<any>,
    public name: string, public borderColor: string = 'rgba(120,120,200,0.8)'
  ) {}

  setVisible(value: boolean) {
    this.gameObject.setVisible(value)
  }
  create() {
    this.gameObject = new Phaser.GameObjects.Text(this.scene, 0, -64, this.name, {
      fontFamily: 'Arial, Helvetica, sans-serif',
      stroke: this.borderColor,
      strokeThickness: 1,
      color: '#fff',
      fontSize: '16px',
      fontStyle: 'bold italic',
    })
    this.gameObject.setOrigin(0.5, 0.5)
    this.gameObject.setResolution(20)
    this.gameObject.setDepth(32)
  }

  update() {
    if (!this.owner) return
    const zoom1 = window.innerWidth / 700
    const zoom2 = window.innerHeight / 700
    const zoom = zoom1 < zoom2 ? zoom1 : zoom2
    this.gameObject.setScale(1 / zoom < 1 ? 1 : 1 / zoom)
  }
  destroy() {
    this.gameObject.destroy()
  }
}

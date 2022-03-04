import { BattleEntity } from '../battle/battle-entity'
import { MovableEntity } from '../movable'

export class NamePlugin {
  text: Phaser.GameObjects.Text
  constructor(
    public scene: Phaser.Scene,
    public owner: MovableEntity<any> | BattleEntity<any>
  ) {}

  setVisible(value: boolean) {
    this.text.setVisible(value)
  }
  create(name: string, borderColor: string = 'rgba(120,120,200,0.8)') {
    this.text = new Phaser.GameObjects.Text(this.scene, 0, -64, name, {
      fontFamily: 'Arial, Helvetica, sans-serif',
      stroke: borderColor,
      strokeThickness: 1,
      color: '#fff',
      fontSize: '16px',
      fontStyle: 'bold italic',
    })
    this.text.setOrigin(0.5, 0.5)
    this.text.setResolution(20)
    this.text.setDepth(32)
  }

  update() {
    if (!this.owner) return
    const zoom1 = window.innerWidth / 700
    const zoom2 = window.innerHeight / 700
    const zoom = zoom1 < zoom2 ? zoom1 : zoom2
    this.text.setScale(1 / zoom < 1 ? 1 : 1 / zoom)
  }
  destroy() {
    this.text.destroy()
  }
}

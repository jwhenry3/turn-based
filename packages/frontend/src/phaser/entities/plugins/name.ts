import { NetworkedScene } from '../../scenes/networked.scene'

export class NamePlugin {
  text: Phaser.GameObjects.Text
  constructor(public scene: NetworkedScene) {}

  setVisible(value:boolean) {
    this.text.setVisible(value)
  }
  create(
    name: string,
    x: number,
    y: number,
    borderColor: string = 'rgba(120,120,200,0.5)'
  ) {
    this.text = this.scene.add.text(x, y - 64, name, {
      fontFamily: 'Arial, Helvetica, sans-serif',
      stroke: borderColor,
      strokeThickness: 2,
      color: '#fff',
      fontSize: '16px',
      fontStyle: 'bold italic',
    })
    this.text.setOrigin(0.5, 0.5)
    this.text.setResolution(20)
    this.text.setDepth(Math.round(y) + 32)
  }

  update(x: number, y: number) {
    const zoom1 = window.innerWidth / 700
    const zoom2 = window.innerHeight / 700
    const zoom = zoom1 < zoom2 ? zoom1 : zoom2
    this.text.setScale(1 / zoom < 1 ? 1 : 1 / zoom)
    if (this.text.x !== x || this.text.y !== y - 64) {
      this.text.setPosition(x, y - 64)
    }
    this.text.setDepth(Math.round(y) + 32)
  }
  destroy() {
    this.text.destroy()
  }
}

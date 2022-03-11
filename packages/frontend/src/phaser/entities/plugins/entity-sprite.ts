import { BattleEntity } from '../battle/battle-entity'
import { MovableEntity } from '../movable'

export class EntitySpritePlugin {
  gameObject: Phaser.GameObjects.Sprite

  lastX = 0
  lastY = 0

  constructor(
    public scene: Phaser.Scene,
    public owner: MovableEntity<any> | BattleEntity<any>
  ) {}
  create() {
    this.gameObject = this.scene.add.sprite(0, 0, 'entity', 0)
    this.gameObject.setOrigin(0.5, 1)
    this.lastX = this.owner.x
    this.lastY = this.owner.y
  }

  update() {
    if (this.owner['facing']) {
      if (this.owner['facing'] === 'left') {
        this.gameObject.setScale(-1, 1)
      } else {
        this.gameObject.setScale(1, 1)
      }
    } else {
      if (this.owner.x !== this.lastX) {
        const diff = this.owner.x - this.lastX
        if (diff > 0) {
          this.gameObject.setScale(1, 1)
        } else if (diff < 0) {
          this.gameObject.setScale(-1, 1)
        }
        this.lastX = this.owner.x
      }
      if (this.owner.y !== this.lastY) {
        this.lastY = this.owner.y
      }
    }

    if (this.owner['isShooting']) {
      if (this.gameObject.anims.getName() !== 'shoot') {
        this.gameObject.anims.stop()
        this.gameObject.anims.play('shoot')
        this.gameObject.x = 8 * this.gameObject.scaleX
      }
    } else {
      this.gameObject.x = 0
      if (this.owner['isCasting']) {
        if (this.gameObject.anims.getName() !== 'cast') {
          this.gameObject.anims.stop()
          this.gameObject.anims.play('cast')
        }
      } else if (this.owner['jumping']) {
        this.gameObject.y = -this.owner['jumpCurrent']
        if (this.gameObject.anims.getName() !== 'jump') {
          this.gameObject.anims.stop()
          this.gameObject.anims.play('jump')
        }
      } else if (
        this.owner['moving'] &&
        this.gameObject.anims.getName() !== 'run'
      ) {
        this.gameObject.anims.stop()
        this.gameObject.anims.play('run')
      } else if (
        !this.owner['moving'] &&
        this.gameObject.anims.getName() !== 'stand'
      ) {
        this.gameObject.anims.stop()
        this.gameObject.anims.play('stand')
      }
    }
  }
}

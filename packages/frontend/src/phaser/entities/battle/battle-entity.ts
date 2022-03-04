import { lerp } from '../../behaviors/lerp'
import { BattleScene } from '../../scenes/battle.scene'
import { SceneConnector } from '../../scenes/scene.connector'
import { NamePlugin } from '../plugins/name'
import { RectanglePlugin } from '../plugins/rectangle'
import { BattlePosition } from './battle-position'

export class BattleEntity<T> extends Phaser.GameObjects.Container {
  rectanglePlugin: RectanglePlugin = new RectanglePlugin(this.scene, this)
  namePlugin: NamePlugin = new NamePlugin(this.scene, this)

  parentContainer: BattlePosition
  constructor(
    public model: T,
    public scene: BattleScene,
    public connector: SceneConnector
  ) {
    super(scene)
  }

  create() {}
}

import { SceneConnector } from './scene.connector'

export class NetworkedScene extends Phaser.Scene {
  connector: SceneConnector
  name: string

  async connect() {
    await this.connector.connect()
  }

  async start() {
    await this.connect()
    this.scene.start(this.name)
  }

  async stop() {
    this.disconnect()
    this.scene.stop(this.name)
  }

  disconnect() {
    this.connector.disconnect()
  }
}

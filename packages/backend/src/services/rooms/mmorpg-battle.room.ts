import { Client, Room } from '@colyseus/core'

export class MmorpgBattleRoom extends Room {
  maxClients: number = 64

  onCreate(options: any): void | Promise<any> {}
  onJoin(client: Client, options?: any, auth?: any): void | Promise<any> {}
}

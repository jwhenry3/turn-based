import {
  Controller,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common'
import { LobbyRoom, Server } from 'colyseus'

@Controller()
export class ServerController
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  constructor(protected server: Server) {}

  onApplicationBootstrap() {
    this.server.define('lobby', LobbyRoom)
    this.server.listen(9200)
    // throw new Error('Method not implemented.')
  }

  async onApplicationShutdown(signal?: string) {
    await this.server.gracefullyShutdown(true)
    // throw new Error('Method not implemented.')
  }
}

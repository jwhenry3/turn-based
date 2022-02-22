import {
  Controller,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common'
import { Server } from 'colyseus'
import { PetopiaLobbyRoom } from './rooms/petopia-lobby.room'
import { PetopiaMapRoom } from './rooms/petopia-map.room'

@Controller()
export class ServerController
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  constructor(protected server: Server) {}

  onApplicationBootstrap() {
    this.server.define('lobby', PetopiaLobbyRoom)
    this.server.define('maps_starter', PetopiaMapRoom)
    this.server.listen(9200)
    // throw new Error('Method not implemented.')
  }

  async onApplicationShutdown(signal?: string) {
    await this.server.gracefullyShutdown(true)
    // throw new Error('Method not implemented.')
  }
}

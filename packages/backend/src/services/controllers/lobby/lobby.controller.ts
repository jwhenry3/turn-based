import {
  Controller,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common'
import { Server } from 'colyseus'
import { MmorpgLobbyRoom } from '../../rooms/mmorpg-lobby.room'

@Controller()
@Injectable()
export class LobbyController
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  constructor(protected server: Server) {}

  onApplicationBootstrap() {
    this.server.define('lobby', MmorpgLobbyRoom)
    this.server.listen(9200)
    // throw new Error('Method not implemented.')
  }

  async onApplicationShutdown(signal?: string) {
    await this.server.gracefullyShutdown(true)
    // throw new Error('Method not implemented.')
  }
}

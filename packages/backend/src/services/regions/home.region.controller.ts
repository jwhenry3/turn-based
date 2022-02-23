import {
  Controller,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common'
import { LobbyRoom, Server } from 'colyseus'
import { PetopiaBattleRoom } from '../../app/servers/rooms/petopia-battle.room'
import { PetopiaMapRoom } from '../../app/servers/rooms/petopia-map.room'

@Controller()
export class HomeRegionController
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  constructor(protected server: Server) {}

  onApplicationBootstrap() {
    this.server.define('lobby', LobbyRoom)
    this.server.define('starter', PetopiaMapRoom).enableRealtimeListing()
    this.server.define('town', PetopiaMapRoom).enableRealtimeListing()
    this.server.define('wilds', PetopiaMapRoom).enableRealtimeListing()
    this.server.define('battle', PetopiaBattleRoom)
    this.server.listen(9201)
    // throw new Error('Method not implemented.')
  }

  async onApplicationShutdown(signal?: string) {
    await this.server.gracefullyShutdown(true)
    // throw new Error('Method not implemented.')
  }
}

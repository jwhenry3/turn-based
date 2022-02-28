import {
  Controller,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common'
import { LobbyRoom, Server } from 'colyseus'
import { starterNpcs } from '../../rooms/fixtures/starter.fixtures'
import { MmorpgBattleRoom } from '../../rooms/mmorpg-battle.room'
import { MmorpgMapRoom } from '../../rooms/mmorpg-map.room'

@Controller()
export class HomeRegionController
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  constructor(protected server: Server) {}

  onApplicationBootstrap() {
    this.server.define('lobby', LobbyRoom)
    this.server
      .define('starter', MmorpgMapRoom, {
        npcs: starterNpcs,
      })
      .enableRealtimeListing()
    this.server.define('town', MmorpgMapRoom).enableRealtimeListing()
    this.server.define('wilds', MmorpgMapRoom).enableRealtimeListing()
    this.server.listen(9201)
    // throw new Error('Method not implemented.')
  }

  async onApplicationShutdown(signal?: string) {
    await this.server.gracefullyShutdown(true)
    // throw new Error('Method not implemented.')
  }
}

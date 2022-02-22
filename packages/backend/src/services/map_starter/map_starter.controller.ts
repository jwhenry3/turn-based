import {
  Controller,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common'
import { Server } from 'colyseus'
import { PetopiaMapRoom } from '../../app/servers/rooms/petopia-map.room'

@Controller()
export class MapStarterController
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  constructor(protected server: Server) {}

  onApplicationBootstrap() {
    this.server.define('map_starter', PetopiaMapRoom)
    this.server.listen(9201)
    // throw new Error('Method not implemented.')
  }

  async onApplicationShutdown(signal?: string) {
    await this.server.gracefullyShutdown(true)
    // throw new Error('Method not implemented.')
  }
}

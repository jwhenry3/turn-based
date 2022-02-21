import { Module } from '@nestjs/common'
import { LobbyRoom, Server } from 'colyseus'
import { ServerController } from './server.controller'

@Module({
  imports: [],
  controllers: [ServerController],
  providers: [
    {
      provide: Server,
      useFactory: () => new Server({}),
    },
  ],
  exports: [Server],
})
export class ServerModule {}

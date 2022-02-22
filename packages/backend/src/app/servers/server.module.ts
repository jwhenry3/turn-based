import { Module } from '@nestjs/common'
import { LobbyRoom, Server } from 'colyseus'
import { DataModule } from '../data/data.module'
import { ServerController } from './server.controller'

@Module({
  imports: [DataModule],
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

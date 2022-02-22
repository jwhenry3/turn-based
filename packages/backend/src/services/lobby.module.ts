import { Module } from '@nestjs/common'
import { LobbyController } from './lobby/lobby.controller'
import { ServerModule } from './server.module'

@Module({
  imports: [ServerModule],
  controllers: [LobbyController],
})
export default class LobbyModule {}

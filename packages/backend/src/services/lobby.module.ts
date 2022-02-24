import { Module } from '@nestjs/common'
import { DataModule } from './data.module'
import { LobbyController } from './controllers/lobby/lobby.controller'
import { ServerModule } from './server.module'

@Module({
  imports: [ServerModule, DataModule.forRoot()],
  controllers: [LobbyController],
})
export default class LobbyModule {}

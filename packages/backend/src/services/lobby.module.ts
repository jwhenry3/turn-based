import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { DataModule } from '../app/data/data.module'
import { AccountModel } from '../app/data/models/account'
import { CharacterModel } from '../app/data/models/character'
import { LobbyController } from './lobby/lobby.controller'
import { ServerModule } from './server.module'

@Module({
  imports: [
    ServerModule,
    SequelizeModule.forFeature([AccountModel, CharacterModel]),
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: './petopia.sqlite',
      autoLoadModels: true,
      models: [AccountModel, CharacterModel],
      synchronize: true,
    }),
  ],
  controllers: [LobbyController],
})
export default class LobbyModule {}

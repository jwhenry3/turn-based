import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AccountModel } from './data/account'
import { AppearanceModel } from './data/appearance'
import { CharacterModel } from './data/character'
import { PositionModel } from './data/position'
import { StatsModel } from './data/stats'

const models = [AccountModel, CharacterModel, AppearanceModel, PositionModel, StatsModel]
@Module({
  imports: [
    SequelizeModule.forFeature(models),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
  exports: [SequelizeModule],
})
export class DataModule {
  static forFeature() {
    return {
      module: DataModule,
      imports: [SequelizeModule.forFeature(models)],
      exports: [SequelizeModule],
    }
  }
}

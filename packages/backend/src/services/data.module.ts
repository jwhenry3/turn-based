import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AccountModel } from './data/account'
import { AppearanceModel } from './data/appearance'
import { CharacterModel } from './data/character'

const models = [AccountModel, CharacterModel, AppearanceModel]
@Module({
  imports: [
    SequelizeModule.forFeature(models),
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: './petopia.sqlite',
      autoLoadModels: true,
      models,
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

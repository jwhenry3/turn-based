import { DynamicModule, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Model, ModelCtor } from 'sequelize-typescript'
import { AccountModel } from './models/account'
import { CharacterModel } from './models/character'

@Module({
  imports: [
    SequelizeModule.forFeature([AccountModel, CharacterModel], {
      dialect: 'sqlite',
    }),
  ],
  exports: [SequelizeModule],
})
export class DataModule {
  static forRoot(models: ModelCtor<Model<any, any>>[]): DynamicModule {
    return {
      module: DataModule,
      imports: [
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: './petopia.sqlite',
          autoLoadModels: true,
          synchronize: true,
        }),
      ],
      exports: [SequelizeModule],
    }
  }
}

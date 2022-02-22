import { DynamicModule, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

@Module({
  imports: [SequelizeModule],
})
export class DataModule {
  static forFeature(models: Function[], dbName: string) {
    return {
      module: DataModule,
      imports: [
        SequelizeModule.forFeature(models, {
          dialect: 'sqlite',
          storage: './petopia.' + dbName + '.sqlite',
        }),
      ],
      exports: [SequelizeModule],
    }
  }
  static forRoot(): DynamicModule {
    return {
      module: DataModule,
      imports: [
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: './petopia.sqlite',
        }),
      ],
      exports: [SequelizeModule],
    }
  }
}

import { Module } from '@nestjs/common'
import { DataModule } from './data.module'
import { HomeRegionController } from './controllers/regions/home.region.controller'
import { ServerModule } from './server.module'

@Module({
  imports: [ServerModule, DataModule.forFeature(), DataModule],
  controllers: [HomeRegionController],
})
export default class HomeRegionModule {}

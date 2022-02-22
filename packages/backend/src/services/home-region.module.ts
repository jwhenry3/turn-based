import { Module } from '@nestjs/common'
import { HomeRegionController } from './regions/home.region.controller'
import { ServerModule } from './server.module'

@Module({
  imports: [ServerModule],
  controllers: [HomeRegionController],
})
export default class HomeRegionModule {}

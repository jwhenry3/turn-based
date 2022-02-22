import { Module } from '@nestjs/common';
import { MapStarterController } from './map_starter/map_starter.controller';
import { ServerModule } from './server.module';

@Module({
  imports: [ServerModule],
  controllers: [MapStarterController]
})
export default class MapStarterModule {

}

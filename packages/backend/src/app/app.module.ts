import * as Nest from '@nestjs/common'
import Module = Nest.Module

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServerModule } from '../services/server.module'
import { DataModule } from './data/data.module'

@Module({
  imports: [ServerModule, DataModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import * as Nest from '@nestjs/common'
import Module = Nest.Module

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ServerModule } from './servers/server.module'

@Module({
  imports: [ServerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

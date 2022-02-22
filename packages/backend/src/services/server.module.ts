import { Module } from '@nestjs/common'
import { Server } from 'colyseus'
import { DataModule } from '../app/data/data.module'

@Module({
  imports: [DataModule],
  controllers: [],
  providers: [
    {
      provide: Server,
      useFactory: () => new Server({}),
    },
  ],
  exports: [Server],
})
export class ServerModule {}

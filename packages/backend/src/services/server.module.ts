import { Module } from '@nestjs/common'
import { Server } from 'colyseus'

@Module({
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

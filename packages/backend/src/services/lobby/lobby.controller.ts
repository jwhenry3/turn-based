import {
  Controller,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Server } from 'colyseus'
import { AccountModel } from '../../app/data/models/account'
import { CharacterModel } from '../../app/data/models/character'
import { PetopiaLobbyRoom } from '../../app/servers/rooms/petopia-lobby.room'

@Controller()
@Injectable()
export class LobbyController
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  constructor(
    protected server: Server,
    @InjectModel(CharacterModel) protected character: typeof CharacterModel,
    @InjectModel(AccountModel) protected account: typeof AccountModel
  ) {}

  onApplicationBootstrap() {
    this.server.define('lobby', PetopiaLobbyRoom, {
      account: this.account,
      character: this.character,
    })
    this.server.listen(9200)
    // throw new Error('Method not implemented.')
  }

  async onApplicationShutdown(signal?: string) {
    await this.server.gracefullyShutdown(true)
    // throw new Error('Method not implemented.')
  }
}

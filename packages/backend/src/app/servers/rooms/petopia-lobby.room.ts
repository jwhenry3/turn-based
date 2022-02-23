import { Client, LobbyRoom, Room } from 'colyseus'
import {
  ArraySchema,
  filterChildren,
  MapSchema,
  Schema,
  type,
} from '@colyseus/schema'
import { LobbyOptions } from '@colyseus/core/build/rooms/LobbyRoom'
import { Account, Appearance, Character, Statistics } from '../schemas'
import { createCharacter } from '../generators/character'
import { createAccount } from '../generators/account'
import { AccountModel } from '../../data/models/account'
import { InjectModel } from '@nestjs/sequelize'
import { CharacterModel } from '../../data/models/character'
import { AppearanceModel } from '../../data/models/appearance'

class LobbyState extends Schema {
  @filterChildren((client, key, value: Account, root) => {
    return value.currentClientId === client.sessionId
  })
  @type({ map: Account })
  accounts = new MapSchema<Account>()
}

export class PetopiaLobbyRoom extends Room {
  accountModels: Record<string, AccountModel> = {}

  // Life Cycle
  async onCreate({
    account: accountRepo,
    character: characterRepo,
  }: {
    account: typeof AccountModel
    character: typeof CharacterModel
  }): Promise<void> {
    this.onMessage('account:login', async (client, { username, password }) => {
      const account = await accountRepo.findOne({ where: { username } })
      console.log(account.hashedPassword)
      if (account?.comparePassword(password)) {
        this.accountModels[client.sessionId] = account
        const accountSchema = createAccount(client.sessionId, account)
        this.state.accounts.set(client.sessionId, accountSchema)
      } else {
        client.send('account:login:failure', {
          message: 'Invalid username or password',
        })
      }
    })

    this.onMessage(
      'account:register',
      async (client, { username, password }) => {
        try {
          const account = await accountRepo.create({
            accountId: AccountModel.id(),
            username,
          })
          await account.setPassword(password)

          await account.save()
          const accountSchema = createAccount(client.sessionId, account)
          this.accountModels[client.sessionId] = account
          this.state.accounts.set(client.sessionId, accountSchema)
        } catch (e) {
          client.send('account:register:failure', {
            message: 'Account already exists',
          })
        }
      }
    )

    this.onMessage('characters:list', async (client, message) => {
      const account = this.state.accounts.get(client.sessionId) as Account
      if (account) {
        const accountModel = this.accountModels[client.sessionId]
        const characters = await CharacterModel.findAll({
          where: {
            accountId: accountModel.accountId,
          },
        })
        account.characterList = new ArraySchema<Character>()
        for (const character of characters) {
          account.characterList.push(createCharacter(character, account))
        }
        account.character = undefined
        return
      }

      client.send('characters:list:failure', {
        message:
          'Could not locate the account on the server, please login again',
      })
    })
    this.onMessage(
      'characters:create',
      async (
        client,
        { name, hair, hairColor, eyes, eyeColor, skinColor, gender }
      ) => {
        const account = this.state.accounts.get(client.sessionId) as Account
        if (account) {
          const accountModel = this.accountModels[client.sessionId]
          const character = await CharacterModel.create({
            characterId: CharacterModel.id(),
            accountId: accountModel.accountId,
            account: accountModel,
            name: name,
          })
          character.appearance = new AppearanceModel({
            hair,
            hairColor,
            eyes,
            eyeColor,
            skinColor,
            gender,
          })
          await character.save()
          account.characterList.push(createCharacter(character, account))
          return
        }
        client.send('characters:create:failure', {
          message:
            'Could not locate the account on the server, please login again',
        })
      }
    )

    this.onMessage('characters:select', (client, message) => {
      const account = this.state.accounts.get(client.sessionId) as Account
      if (account) {
        const character = account.characterList.find(
          (character) => character.characterId === message.characterId
        )
        account.character = character
      }
    })

    this.setState(new LobbyState())
  }

  onJoin(client: Client, options: LobbyOptions): void {}

  onLeave(client: Client): void {}
}

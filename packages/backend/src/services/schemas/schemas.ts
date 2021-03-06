import { Client } from '@colyseus/core'
import {
  ArraySchema,
  filter,
  filterChildren,
  MapSchema,
  Schema,
  type,
} from '@colyseus/schema'
import { SpatialNode } from '../rooms/spacial/node'
import SpatialHash from 'spatial-hash'
import { Attribute, Battle, Statistics } from './battles'

export class Movement extends Schema {
  @type('string')
  facing: 'up' | 'down' | 'left' | 'right' = 'down'
  @type('number')
  horizontal: 1 | -1 | 0 = 0
  @type('number')
  vertical: 1 | -1 | 0 = 0
}
export class PositionData extends Schema {
  @type('string')
  map: string = 'starter'
  @type('number')
  x = 100
  @type('number')
  y = 100
  @type('number')
  speed = 4

  @type(Movement)
  movement: Movement = new Movement()

  @type('number')
  destinationX?: number
  @type('number')
  destinationY?: number

  useVelocity = false
  @type('number')
  velocityX = 0
  @type('number')
  velocityY = 0
  nextX = 100
  nextY = 100

  isWithinBounds = true

  isPlayerPosition = false

  owner: Character | Npc

  delta = 0

  getNextPosition(deltaTime: number) {
    const angle = Math.atan2(this.movement.vertical, this.movement.horizontal)
    this.delta = Math.round(Math.round(deltaTime) / 12)
    this.nextX = Math.round(this.x + Math.cos(angle) * this.speed * this.delta)
    this.nextY = Math.round(this.y + Math.sin(angle) * this.speed * this.delta)
  }
}

export class Appearance extends Schema {
  @type('string')
  hair: string
  @type('string')
  hairColor: string
  @type('string')
  eyes: string
  @type('string')
  eyeColor: string
  @type('string')
  skinColor: string
  @type('string')
  gender: string
}

export class Effect extends Schema {
  @type('string')
  effectId: string
  @type(Attribute)
  potency: Attribute = new Attribute({ baseAmount: 1 })
  @type('number')
  remainingDuration: number
}

export class Status extends Schema {
  @type('number')
  hp: number
  @type('number')
  mp: number
  @type({ array: Effect })
  effects: ArraySchema<Effect> = new ArraySchema<Effect>()
}
export class ItemCategory extends Schema {
  @type('string')
  category: string
  @type('string')
  secondaryCategory: string
  @type('string')
  tertiaryCategory: string
}

export class Item extends Schema {
  @type('string')
  itemId: string
  @type(ItemCategory)
  category: ItemCategory
}

export class InventoryItem extends Schema {
  @type('string')
  inventoryItemId: string
  @type('string')
  itemId: string
  @type('number')
  quantity: number
  @type('number')
  inventoryPositionId: number
}

export class EquipmentProfile extends Schema {
  @type('number')
  displayOrder: number
  @type('string')
  label: string
  @type({ map: 'string' })
  equipment: MapSchema<string> = new MapSchema<string>({
    head: undefined,
    chest: undefined,
    arms: undefined,
    legs: undefined,
    feet: undefined,
    leftHand: undefined,
    rightHand: undefined,
  })
}

export class Inventory extends Schema {
  @type('string')
  accountId: string
  @type('string')
  characterId: string
  @type('string')
  currentClientId: string

  /**
   * We only want the current client to see this character's inventory
   * security and performance reasons
   */
  @filter(
    (model: Inventory, client: Client) =>
      model.currentClientId === client.sessionId
  )
  @type({ map: InventoryItem })
  inventoryItems: MapSchema<InventoryItem> = new MapSchema<InventoryItem>()

  @type({ map: 'string' })
  equippedItems: MapSchema<string> = new MapSchema<string>({})
  /**
   * items used as cosmetic display
   */
  @type({ map: 'string' })
  wardrobe: MapSchema<string> = new MapSchema<string>({})

  /**
   * We only want the current client to see this character's equipment profiles
   * security and performance reasons
   */
  @filter(
    (model: Inventory, client: Client) =>
      model.currentClientId === client.sessionId
  )
  @type({ map: EquipmentProfile })
  equipmentProfiles: MapSchema<EquipmentProfile> = new MapSchema<EquipmentProfile>()
}

export class ItemDrop extends Schema {
  // Odds from 0-1 of dropping the item (percentage chance of drop)
  @type('number')
  chance: number = 1
  @type('number')
  quantity: number = 1
  @type('string')
  itemId: string
}

export class Npc extends Schema {
  @type('string')
  npcId: string

  @type('string')
  npcTypeId: string

  @type('string')
  name: string

  // Not visible on client
  @filter(() => false)
  @type({ array: ItemDrop })
  drops: ArraySchema<ItemDrop> = new ArraySchema<ItemDrop>()

  @type(PositionData)
  position: PositionData = new PositionData()

  node: SpatialNode<Npc>
  hash: SpatialHash

  @type('boolean')
  despawned: boolean = false

  respawnTime = 1000
  respawnTimer = 0
}

export class PetNpc extends Npc {
  @type('string')
  characterId: string

  @type(Statistics)
  stats: Statistics = new Statistics()
}

export class Character extends Schema {
  @type('string')
  accountId: string
  @type('string')
  characterId: string
  @type('string')
  currentClientId: string
  @type('string')
  name: string

  @type('boolean')
  isInBattle: boolean = false

  @type('string')
  battleId: string

  @type('string')
  status: 'connected' | 'reconnecting' | 'disconnected' = 'connected'

  @type(Appearance)
  appearance: Appearance = new Appearance()

  @type(Statistics)
  stats: Statistics = new Statistics()

  @type(PositionData)
  position: PositionData = new PositionData()

  @type(Inventory)
  inventory: Inventory = new Inventory()

  @type(PetNpc)
  pet: PetNpc

  node: SpatialNode<Character>
  hash: SpatialHash
}

export class AccountToken extends Schema {
  @type('string')
  token = ''
  @type('number')
  expires = new Date().valueOf()
}
export class Account extends Schema {
  @type('string')
  accountId: string
  @type('string')
  username: string
  @type('string')
  currentClientId: string

  @type(Character)
  character: Character

  @filter((account, client) => account.currentClientId === client.sessionId)
  @type(AccountToken)
  token: AccountToken = new AccountToken()

  // Only current client can see character list
  @filter((account, client) => account.currentClientId === client.sessionId)
  @type({ array: Character })
  characterList: ArraySchema<Character> = new ArraySchema<Character>()
}

export class MmorpgMapState extends Schema {
  @type({ map: Character })
  players = new MapSchema<Character>()
  @type({ map: Character })
  playersByClient = new MapSchema<Character>()

  @type({ map: Npc })
  npcs = new MapSchema<Npc>()

  @type({ map: Battle })
  battles = new MapSchema<Battle>()
}

export class LobbyState extends Schema {
  @filterChildren((client, key, value: Account, root) => {
    return value.currentClientId === client.sessionId
  })
  @type({ map: Account })
  accounts = new MapSchema<Account>()
}

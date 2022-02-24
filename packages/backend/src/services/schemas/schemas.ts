import { Client } from '@colyseus/core'
import { ArraySchema, filter, MapSchema, Schema, type } from '@colyseus/schema'
import { AccountTokenModel } from '../data/account'

export class Movement extends Schema {
  @type('string')
  facing: 'up' | 'down' | 'left' | 'right' = 'down'
  @type('number')
  horizontal: 1 | -1 | 0 = 0
  @type('number')
  vertical: 1 | -1 | 0 = 0
}
export class Position extends Schema {
  @type('string')
  map: string = 'starter'
  @type('number')
  x = 100
  @type('number')
  y = 100

  @type(Movement)
  movement: Movement = new Movement()
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

export class Attribute extends Schema {
  @type('number')
  base: number = 0
  @type('number')
  fromPoints: number = 0
  @type('number')
  fromEquipment: number = 0
  @type('number')
  fromBuffs: number = 0
  @type('number')
  total: number
}

export class Statistics extends Schema {
  @type('number')
  level: number = 1

  // not visible on client
  @filter(() => false)
  @type('number')
  grantExpOnDeath: number = 0

  @type('number')
  currentExp: number = 0
  @type('number')
  maxExpForCurrentLevel: number = 100
  @type('number')
  availableStatPoints: number = 5

  @type(Attribute)
  maxHp: Attribute = new Attribute({base:100})
  @type(Attribute)
  maxMp: Attribute = new Attribute({base:100})
  @type(Attribute)
  str: Attribute = new Attribute({base:5})
  @type(Attribute)
  dex: Attribute = new Attribute({base:5})
  @type(Attribute)
  vit: Attribute = new Attribute({base:5})
  @type(Attribute)
  agi: Attribute = new Attribute({base:5})
  @type(Attribute)
  int: Attribute = new Attribute({base:5})
  @type(Attribute)
  mnd: Attribute = new Attribute({base:5})
  @type(Attribute)
  chr: Attribute = new Attribute({base:5})
}
export class Effect extends Schema {
  @type('string')
  effectId: string
  @type(Attribute)
  potency: Attribute = new Attribute({base:1})
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

export class Character extends Schema {
  @type('string')
  accountId: string
  @type('string')
  characterId: string
  @type('string')
  currentClientId: string
  @type('string')
  name: string

  @type(Appearance)
  appearance: Appearance = new Appearance()

  @type(Statistics)
  stats: Statistics = new Statistics()

  @type(Position)
  position: Position = new Position()

  @type(Inventory)
  inventory: Inventory = new Inventory()
}

export class ItemDrop extends Schema {
  @type('number')
  rate: number
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

  @type(Statistics)
  stats: Statistics = new Statistics()

  @type(Position)
  position: Position = new Position()
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

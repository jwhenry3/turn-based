import { Client } from '@colyseus/core'
import {
  ArraySchema,
  filter,
  filterChildren,
  MapSchema,
  Schema,
  type,
} from '@colyseus/schema'

export class Position extends Schema {
  @type('string')
  map: string
  @type('number')
  x = 100
  @type('number')
  y = 100
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
  base: number
  @type('number')
  fromEquipment: number
  @type('number')
  fromBuffs: number
  @type('number')
  total: number
}

export class Statistics extends Schema {
  @type('number')
  level: number

  // not visible on client
  @filter(() => false)
  @type('number')
  grantExpOnDeath: number

  @type('number')
  currentExp: number
  @type('number')
  maxExpForCurrentLevel: number
  @type('number')
  availableStatPoints: number

  @type(Attribute)
  maxHp: Attribute
  @type(Attribute)
  maxMp: Attribute
  @type(Attribute)
  str: Attribute
  @type(Attribute)
  dex: Attribute
  @type(Attribute)
  vit: Attribute
  @type(Attribute)
  agi: Attribute
  @type(Attribute)
  int: Attribute
  @type(Attribute)
  mnd: Attribute
  @type(Attribute)
  chr: Attribute
}
export class Effect extends Schema {
  @type('string')
  effectId: string
  @type(Attribute)
  potency: Attribute
  @type('number')
  remainingDuration: number
}

export class Status extends Schema {
  @type('number')
  hp: number
  @type('number')
  mp: number
  @type({ array: Effect })
  effects: ArraySchema<Effect>
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
  @type({ map: Item })
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
  equippedItems: MapSchema<string> = new MapSchema<string>({
    head: undefined,
    chest: undefined,
    arms: undefined,
    legs: undefined,
    feet: undefined,
    leftHand: undefined,
    rightHand: undefined,
  })
  /**
   * items used as cosmetic display
   */
  @type({ map: 'string' })
  wardrobe: MapSchema<string> = new MapSchema<string>({
    head: undefined,
    chest: undefined,
    arms: undefined,
    legs: undefined,
    feet: undefined,
    leftHand: undefined,
    rightHand: undefined,
  })

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
  appearance: Appearance

  @type(Statistics)
  stats: Statistics

  @type(Position)
  position: Position

  @type(Inventory)
  inventory: Inventory
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
  stats: Statistics

  @type(Position)
  position: Position
}

export class Account extends Schema {
  @type('string')
  accountId: string
  @type('string')
  currentClientId: string
  @type(Character)
  character: Character
  @type({ array: Character })
  characterList: ArraySchema<Character> = new ArraySchema<Character>()
}

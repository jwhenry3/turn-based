// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { InventoryItem } from './InventoryItem'
import { EquipmentProfile } from './EquipmentProfile'

export class Inventory extends Schema {
    @type("string") public accountId!: string;
    @type("string") public characterId!: string;
    @type("string") public currentClientId!: string;
    @type({ map: InventoryItem }) public inventoryItems: MapSchema<InventoryItem> = new MapSchema<InventoryItem>();
    @type({ map: "string" }) public equippedItems: MapSchema<string> = new MapSchema<string>();
    @type({ map: "string" }) public wardrobe: MapSchema<string> = new MapSchema<string>();
    @type({ map: EquipmentProfile }) public equipmentProfiles: MapSchema<EquipmentProfile> = new MapSchema<EquipmentProfile>();
}

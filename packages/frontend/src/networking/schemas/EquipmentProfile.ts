// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class EquipmentProfile extends Schema {
    @type("number") public displayOrder!: number;
    @type("string") public label!: string;
    @type({ map: "string" }) public equipment: MapSchema<string> = new MapSchema<string>();
}

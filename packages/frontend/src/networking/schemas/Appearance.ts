// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.33
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class Appearance extends Schema {
    @type("string") public hair!: string;
    @type("string") public hairColor!: string;
    @type("string") public eyes!: string;
    @type("string") public eyeColor!: string;
    @type("string") public skinColor!: string;
    @type("string") public gender!: string;
}

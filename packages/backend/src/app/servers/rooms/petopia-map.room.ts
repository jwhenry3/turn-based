import { Room } from '@colyseus/core'
import { MapSchema, Schema, type } from '@colyseus/schema'

export class Player extends Schema {
  @type('number')
  x = 100
  @type('number')
  y = 100
}

export class PetopiaMapState extends Schema {
  @type({ map: Player })
  player = new MapSchema<Player>()
}

export class PetopiaMapRoom extends Room {

  onCreate(options: any): void | Promise<any> {


    this.setState(new PetopiaMapState())
  }
}

import { Column, Model, PrimaryKey, Unique } from 'sequelize-typescript'

export class PositionModel extends Model {
  @Unique
  @Column
  characterId: string

  @PrimaryKey
  @Column
  positionId: string

  @Column
  x: number

  @Column
  y: number

  @Column
  facing: 'left' | 'right' | 'down' | 'up'

  @Column
  map: string
}

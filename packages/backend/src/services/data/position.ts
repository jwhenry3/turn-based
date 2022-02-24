import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript'
import { CharacterModel } from './character'

@Table
export class PositionModel extends Model {
  @ForeignKey(() => CharacterModel)
  @Unique
  @Column
  characterId: string

  @PrimaryKey
  @Column
  positionId: string

  @Column
  x: number = 0

  @Column
  y: number = 0

  @Column
  facing: 'left' | 'right' | 'down' | 'up' = 'down'

  @Column
  map: string = 'starter'
}

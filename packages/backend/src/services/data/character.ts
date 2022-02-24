import {
  AllowNull,
  Column,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript'
import { AppearanceModel } from './appearance'
import { PositionModel } from './position'
import { StatsModel } from './stats'

@Table
export class CharacterModel extends Model {
  @AllowNull(false)
  @Column
  accountId: string

  @PrimaryKey
  @AllowNull(false)
  @Column
  characterId: string

  @AllowNull(false)
  @Unique
  @Column
  name: string

  @HasOne(() => AppearanceModel)
  appearance: AppearanceModel = new AppearanceModel()

  @HasOne(() => PositionModel)
  position: PositionModel = new PositionModel()

  @HasOne(() => StatsModel)
  stats: StatsModel = new StatsModel()
}

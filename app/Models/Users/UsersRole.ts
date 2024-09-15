import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Role from './Role'

export default class UsersRole extends BaseModel {
  @column({
    isPrimary: true,
  })
  public id: number

  @column({
    serializeAs: null,
  })
  public user_id: number

  @column({
    serializeAs: null,
  })
  public role_id: number

  // Relaciones
  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Role, {
    localKey: 'id',
    foreignKey: 'role_id',
  })
  public role: BelongsTo<typeof Role>
}

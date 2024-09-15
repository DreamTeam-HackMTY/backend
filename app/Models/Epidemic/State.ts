import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Case from './Case'

export default class State extends BaseModel {
  @column({
    isPrimary: true,
  })
  public id: number

  @column()
  public name: string

  @column()
  public active: boolean

  @hasMany(() => Case, {
    localKey: 'id',
    foreignKey: 'state_id',
    onQuery: (query) => query.preload('disease'),
  })
  public cases: HasMany<typeof Case>
}

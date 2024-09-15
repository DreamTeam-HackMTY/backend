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
    foreignKey: 'case_id',
  })
  public cases: HasMany<typeof Case>
}

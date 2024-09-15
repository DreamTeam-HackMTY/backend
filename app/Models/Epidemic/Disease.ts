import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import FormatDates from 'App/Services/FormatDates'
import { DateTime } from 'luxon'
import Case from './Case'

export default class Disease extends BaseModel {
  @column({
    isPrimary: true,
  })
  public id: number

  @column()
  public name: string

  @column()
  public description?: string | null

  @column()
  public active: boolean

  @column.dateTime({
    autoCreate: true,
    ...FormatDates.serializeDates(),
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    ...FormatDates.serializeDates(),
  })
  public updatedAt: DateTime

  @hasMany(() => Case, {
    localKey: 'id',
    foreignKey: 'disease_id',
    onQuery: (query) => query.preload('state'),
  })
  public cases: HasMany<typeof Case>
}

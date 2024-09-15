import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import FormatDates from 'App/Services/FormatDates'
import { DateTime } from 'luxon'
import Disease from './Disease'
import State from './State'

export default class Case extends BaseModel {
  @column({
    isPrimary: true,
  })
  public id: number

  @column()
  public disease_id: number

  @column()
  public state_id: number

  @column()
  public quantity: number

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

  // Relaciones
  @belongsTo(() => Disease, {
    localKey: 'id',
    foreignKey: 'disease_id',
  })
  public disease: BelongsTo<typeof Disease>

  @belongsTo(() => State, {
    localKey: 'id',
    foreignKey: 'state_id',
  })
  public state: BelongsTo<typeof State>
}

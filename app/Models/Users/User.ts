import {
  column,
  beforeSave,
  BaseModel,
  manyToMany,
  ManyToMany,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime } from 'luxon'
import FormatDates from 'App/Services/FormatDates'
import Role from './Role'
import UsersRole from './UsersRole'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public username: string

  @column()
  public rememberMeToken: string | null

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

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // Relaciones
  @manyToMany(() => Role, {
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
    pivotTable: 'users_roles',
  })
  public roles: ManyToMany<typeof Role>

  @hasMany(() => UsersRole, {
    localKey: 'id',
    foreignKey: 'user_id',
  })
  public users_roles: HasMany<typeof UsersRole>
}

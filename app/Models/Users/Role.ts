import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import UsersRole from './UsersRole'
import User from './User'

export default class Role extends BaseModel {
  @column({
    isPrimary: true,
  })
  public id: number

  @column()
  public name: string

  @column()
  public active: boolean

  // Relaciones
  @manyToMany(() => User, {
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
    pivotTable: 'users_roles',
  })
  public users: ManyToMany<typeof User>

  @hasMany(() => UsersRole, {
    localKey: 'id',
    foreignKey: 'role_id',
  })
  public users_roles: HasMany<typeof UsersRole>

  private static ROLES = {
    DEV: 1,
    ADMIN: 2,
    ESPECIALISTA: 3,
    INVITADO: 4,
  } as const

  // Métodos
  public static getRoles() {
    return this.ROLES
  }
}

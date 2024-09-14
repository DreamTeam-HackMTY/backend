import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'states'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 200).notNullable()
      table.boolean('active').defaultTo(true).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

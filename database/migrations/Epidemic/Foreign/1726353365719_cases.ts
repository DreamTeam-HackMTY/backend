import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cases'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('disease_id')
        .unsigned()
        .references('id')
        .inTable('diseases')
        .onDelete('CASCADE')
      table
        .integer('state_id')
        .unsigned()
        .references('id')
        .inTable('states')
        .onDelete('CASCADE')
      table.integer('quantity').notNullable()
      table.boolean('is_deaths').notNullable()
      table.boolean('active').defaultTo(true).notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

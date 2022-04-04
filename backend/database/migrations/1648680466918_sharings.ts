import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Sharings extends BaseSchema {
  protected tableName = 'sharings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('sharing_id')
      table.integer('user_id').notNullable()
      table.integer('user_shared_id').notNullable()
      table
        .integer('todo_id')
        .unsigned()
        .notNullable()
        .references('todo_id')
        .inTable('todos')
        .onDelete('CASCADE')

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

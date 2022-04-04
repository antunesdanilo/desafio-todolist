import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tasks extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('task_id').primary()
      table.integer('user_id').notNullable()
      table
        .integer('todo_id')
        .unsigned()
        .notNullable()
        .references('todo_id')
        .inTable('todos')
        .onDelete('CASCADE')
      table.integer('parent_id').nullable()
      table.string('name', 255).notNullable()
      table.date('deadline').notNullable()
      table.boolean('checked').notNullable()
      table.dateTime('checked_datetime')

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

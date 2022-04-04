import { DateTime } from 'luxon'
import {
  afterDelete,
  beforeUpdate,
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public task_id: number

  @column()
  public user_id: number

  @column()
  public todo_id: number

  @column()
  public parent_id?: number | null = null

  @column()
  public name: string

  @column({
    serialize: (value?: Date | string) => {
      if (!value) return null
      if (typeof value === 'string') return value
      return (
        value.getFullYear() +
        '-' +
        (value.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        value.getDate().toString().padStart(2, '0')
      )
    },
  })
  public deadline: Date

  @column()
  public checked: boolean = false

  @column()
  public checked_datetime: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'user_id',
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => Task, {
    localKey: 'task_id',
    foreignKey: 'parent_id',
  })
  public tasks: HasMany<typeof Task>

  @afterDelete()
  public static async promotes_orphan_tasks_after_delete(task) {
    await Database.rawQuery(`update tasks set parent_id = null WHERE parent_id = ${task.task_id}`)
  }

  @beforeUpdate()
  public static async promote_orphan_tasks_before_update(task) {
    if (!task.$original.parent_id && task.$attributes.parent_id) {
      await Database.rawQuery(`update tasks set parent_id = null WHERE parent_id = ${task.task_id}`)
    }
  }
}

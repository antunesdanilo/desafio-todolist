import { DateTime } from 'luxon'
import {
  column,
  BaseModel,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  computed,
} from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import Sharing from './Sharing'
import Task from './Task'

export default class Todo extends BaseModel {
  @column({ isPrimary: true })
  public todo_id: number

  @column()
  public user_id: number

  @column()
  public name: string

  @column()
  public url: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get tasks_count() {
    if (this.$extras.tasks_count !== undefined) {
      return this.$extras.tasks_count
    }
    if (this.$extras.tasks) {
      return this.$extras.tasks.length
    }
    return null
  }

  @computed()
  public get tasks_checked_count() {
    if (this.$extras.tasks_checked_count !== undefined) {
      return this.$extras.tasks_checked_count
    }
    if (this.$extras.tasks) {
      this.$extras.tasks.filter((t) => t.checked === true).length
    }
    return null
  }

  @computed()
  public get tasks_unchecked_count() {
    if (this.$extras.tasks_unchecked_count !== undefined) {
      return this.$extras.tasks_unchecked_count
    }
    if (this.$extras.tasks) {
      this.$extras.tasks.filter((t) => t.checked !== true).length
    }
    return null
  }

  @belongsTo(() => User, {
    localKey: 'user_id',
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => Sharing, {
    localKey: 'todo_id',
    foreignKey: 'todo_id',
  })
  public sharing: HasMany<typeof Sharing>

  @hasMany(() => Task, {
    localKey: 'todo_id',
    foreignKey: 'todo_id',
  })
  public tasks: HasMany<typeof Task>
}

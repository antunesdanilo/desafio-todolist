import { DateTime } from 'luxon'
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import User from './User'
import Todo from './Todo'

export default class Sharing extends BaseModel {
  @column({ isPrimary: true })
  public sharing_id: number

  @column()
  public user_id: number

  @column()
  public user_shared_id: number

  @column()
  public todo_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'user_id',
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => User, {
    localKey: 'user_id',
    foreignKey: 'user_shared_id',
  })
  public user_shared: BelongsTo<typeof User>

  @belongsTo(() => Todo, {
    localKey: 'todo_id',
    foreignKey: 'todo_id',
  })
  public todo: BelongsTo<typeof Todo>
}

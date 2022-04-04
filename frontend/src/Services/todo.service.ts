import BaseService from './base.service';

import TodoInterface from '../Interfaces/todo.interface';
import TaskInterface, { TaskUpdateInterface } from '../Interfaces/task.interface';

export default class TodoService extends BaseService {
  listTodo(): Promise<Response> {
    return this.get('/todo');
  }

  listSharedTodo(): Promise<Response> {
    return this.get('/todo/shared');
  }

  viewTodo(id: number): Promise<Response> {
    return this.get(`/todo/${id}`);
  }

  addTodo(form: TodoInterface): Promise<Response> {
    return this.post('/todo', form);
  }

  updateTodo(id: number, form: TodoInterface): Promise<Response> {
    return this.put(`/todo/${id}`, form);
  }

  removeTodo(id: number): Promise<Response> {
    return this.delete(`/todo/${id}`);
  }

  listTask(todoId: number): Promise<Response> {
    return this.get(`/task?todo_id=${todoId}`);
  }

  addTask(form: TaskInterface): Promise<Response> {
    return this.post('/task', form);
  }

  updateTask(id: number, form: TaskUpdateInterface): Promise<Response> {
    return this.put(`/task/${id}`, form);
  }

  removeTask(id: number): Promise<Response> {
    return this.delete(`/task/${id}`);
  }
}

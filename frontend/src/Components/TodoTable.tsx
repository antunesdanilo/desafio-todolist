import React from 'react';
import { Link } from 'react-router-dom';

import TodoInterface from '../Interfaces/todo.interface';

import TodoService from '../Services/todo.service';
const todoService = new TodoService();

const TodoTable: React.FC<{
  list: TodoInterface[];
  emptyMsg: string;
  reload: Function;
  onSharePress?: Function;
}> = ({ list, emptyMsg, reload, onSharePress }) => {
  const remove = (todoId: number) => {
    if (window.confirm('Deseja realmente remover esta lista?')) {
      todoService.removeTodo(todoId).then(() => {
        reload();
      });
    }
  };

  return (
    <>
      <table id="todo-table" className="table table-bordered">
        <thead>
          <tr>
            <td>Nome</td>
            <td className="td-center">URL</td>
            <td className="td-center">Total de Tarefas</td>
            <td className="td-center">Tarefas Cumpridas</td>
            <td className="td-center">Tarefas a Cumprir</td>
            <td className="td-center" colSpan={onSharePress ? 3 : 2}>
              Ações
            </td>
          </tr>
        </thead>
        <tbody>
          {list.map((l) => (
            <tr key={l.todo_id}>
              <td>
                <Link to={{ pathname: `/todo/${l.todo_id}/${l.url}` }}>{l.name}</Link>
              </td>
              <td className="td-center">{l.url}</td>
              <td className="td-center">{l.tasks_count}</td>
              <td className="td-center">{l.tasks_checked_count}</td>
              <td className="td-center">{l.tasks_unchecked_count}</td>
              {onSharePress && (
                <td className="td-center">
                  <i className="bi bi-share-fill" onClick={() => onSharePress(l)} />
                </td>
              )}
              <td className="td-center">
                <Link to={{ pathname: `/todo/update/${l.todo_id}/${l.url}` }}>
                  <i className="bi bi-pencil" title="Editar" />
                </Link>
              </td>
              <td className="td-center">
                <i onClick={() => remove(l.todo_id)} className="bi bi-trash" title="Remover" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!list.length && (
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">{emptyMsg}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoTable;

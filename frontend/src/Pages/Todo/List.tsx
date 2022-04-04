import React from 'react';
import { Link } from 'react-router-dom';

import TodoTable from '../../Components/TodoTable';
import ShareModal from '../../Components/ShareModal';

import TodoInterface from '../../Interfaces/todo.interface';

import TodoService from '../../Services/todo.service';
const todoService = new TodoService();

const TodoList: React.FC = () => {
  const [todos, setTodos] = React.useState<TodoInterface[]>([]);
  const [sharedTodos, setSharedTodos] = React.useState<TodoInterface[]>([]);

  const [showShareModal, setShowShareModal] = React.useState<boolean>(false);
  const [todoToShared, setTodoToShared] = React.useState<TodoInterface | null>(null);

  const getListTodo = async (): Promise<TodoInterface[]> => {
    const response = await todoService.listTodo();
    return response as any as TodoInterface[];
  };

  const getListSharedTodo = async (): Promise<TodoInterface[]> => {
    const response = await todoService.listSharedTodo();
    return response as any as TodoInterface[];
  };

  React.useEffect(() => {
    getListTodo().then((l) => setTodos(l));
    getListSharedTodo().then((ls) => setSharedTodos(ls));
  }, []);

  return (
    <div id="todo-list" className="container-fluid">
      <div className="row content-header">
        <div className="col-sm-10">
          <h2>Listas</h2>
        </div>
        <div className="col-sm-2 text-end">
          <Link to="new">
            <button type="button" className="btn btn-outline-secondary add-button">
              Adicionar
            </button>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <h4>Minhas Listas</h4>
          <br />
          <TodoTable
            list={todos}
            emptyMsg="Você ainda não criou nenhuma lista."
            reload={() => getListTodo().then((l) => setTodos(l))}
            onSharePress={(todo: React.SetStateAction<TodoInterface | null>) => {
              setTodoToShared(todo);
              setShowShareModal(true);
            }}
          />
        </div>
      </div>
      <br />
      <br />
      <div className="row">
        <div className="col-sm-12">
          <h4>Listas Compartilhadas Comigo</h4>
          <br />
          <TodoTable
            list={sharedTodos}
            emptyMsg="Ainda não compartilharam nenhuma lista com você."
            reload={() => getListSharedTodo().then((ls) => setSharedTodos(ls))}
          />
        </div>
      </div>
      {todoToShared && (
        <ShareModal
          show={showShareModal}
          todo={todoToShared}
          onHidePress={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default TodoList;

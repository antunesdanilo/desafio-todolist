import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import TodoInterface from '../../Interfaces/todo.interface';

import TodoService from '../../Services/todo.service';
const todoService = new TodoService();

const TodoForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { register, handleSubmit, setValue } = useForm<TodoInterface>();

  const viewTodo = async (): Promise<void> => {
    if (parseInt(params.id || '', 10)) {
      todoService.viewTodo(parseInt(params.id || '', 10)).then((r) => {
        const todo = r as any as TodoInterface;
        setValue('name', todo.name);
        setValue('url', todo.url);
      });
    }
  };

  React.useEffect(() => {
    viewTodo();
  }, []);

  const save = async (form: TodoInterface) => {
    if (parseInt(params.id || '', 10)) {
      return await todoService.updateTodo(parseInt(params.id || '', 10), form);
    }
    const response = (await todoService.addTodo(form)) as any as TodoInterface;
    return navigate(`/todo/${response.todo_id}/${response.url}`, { replace: true });
  };

  return (
    <div id="todo-form" className="container-fluid">
      <div className="row content-header">
        <div className="col-sm-12">
          <h2>
            <i className="bi bi-arrow-left" onClick={() => navigate(-1)} />{' '}
            {parseInt(params.id || '', 10) ? 'Atualizar' : 'Nova'} Lista
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(save)}>
        <div className="row form-field">
          <div className="col-sm-3">Nome</div>
          <div className="col-sm-9">
            <input {...register('name', { required: true })} className="form-control" />
          </div>
        </div>

        <div className="row form-field">
          <div className="col-sm-3">URL</div>
          <div className="col-sm-9">
            <input {...register('url', { required: true })} className="form-control" />
          </div>
        </div>

        <div className="row form-submit">
          <div className="col-sm-1">
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;

import React from 'react';
import { useForm } from 'react-hook-form';

import TaskInterface from '../Interfaces/task.interface';

import TodoService from '../Services/todo.service';
const todoService = new TodoService();

const TaskForm: React.FC<{
  todo_id: number;
  task?: TaskInterface;
  parent_id?: number;
  parent_name?: string;
  reload: Function;
  cancel: Function;
}> = ({ todo_id, task, parent_id, parent_name, reload, cancel }) => {
  const { register, handleSubmit, setValue } = useForm<TaskInterface>();

  const cleanFields = () => {
    setValue('parent_id', undefined);
    setValue('name', '');
    setValue('deadline', '');
  };

  React.useEffect(() => {
    setValue('todo_id', todo_id);
    cleanFields();
    if (parent_id) {
      setValue('parent_id', parent_id);
    }
    if (task) {
      setValue('name', task.name);
      setValue('deadline', task.deadline);
    }
  }, [task, parent_id]);

  const save = async (form: TaskInterface) => {
    if (task) {
      await todoService.updateTask(task.task_id, form);
    } else {
      await todoService.addTask(form);
    }
    reload();
    cleanFields();
    cancel();
  };

  return (
    <form id="task-form" onSubmit={handleSubmit(save)}>
      <div className="row">
        <div className="col-sm-12">
          {!task && !parent_id && 'Nova Tarefa'}
          {!task && parent_id && `Nova Sub-Tarefa de ${parent_name}`}
          {task && `Editando ${task.name}`}
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-sm-5">
          <label>Título da Tarefa:</label>
          <input
            {...register('name', { required: true })}
            type="text"
            placeholder="Tarefa"
            className="form-control"
          />
        </div>
        <div className="col-sm-4">
          <label>Prazo:</label>
          <input
            {...register('deadline', { required: true })}
            type="date"
            className="form-control"
          />
        </div>
        <div className="col-sm-3">
          <label style={{ width: '100%' }} />
          <button id="add-task-button" type="submit" className="btn btn-primary float-end">
            {task ? 'Atualizar' : 'Adicionar'}
          </button>
          <button type="button" className="btn btn-danger float-end" onClick={() => cancel()}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;

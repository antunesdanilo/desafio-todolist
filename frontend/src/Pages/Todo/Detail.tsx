import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TodoInterface from '../../Interfaces/todo.interface';
import TaskInterface from '../../Interfaces/task.interface';

import TaskForm from '../../Components/TaskForm';
import TaskTable from '../../Components/TaskTable';

import ShareModal from '../../Components/ShareModal';

import TodoService from '../../Services/todo.service';
const todoService = new TodoService();

const TodoDetail: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [todo, setTodo] = React.useState<TodoInterface>();
  const [shared, setShared] = React.useState<boolean>(false);

  const [tasks, setTasks] = React.useState<TaskInterface[]>([]);
  const [taskEdit, setTaskEdit] = React.useState<TaskInterface>();
  const [parentId, setParentId] = React.useState<number>();
  const [parentName, setParentName] = React.useState<string>();

  const [showShareModal, setShowShareModal] = React.useState<boolean>(false);

  const viewTodo = async () => {
    if (parseInt(params.id || '', 10)) {
      const response = await todoService.viewTodo(parseInt(params.id || '', 10));
      return response as any as TodoInterface;
    }
  };

  const listTasks = async () => {
    if (parseInt(params.id || '', 10)) {
      const response = await todoService.listTask(parseInt(params.id || '', 10));
      return response as any as TaskInterface[];
    }
    return [];
  };

  React.useEffect(() => {
    viewTodo().then((r: any) => {
      setShared(r.shared);
      setTodo(r.todo);
    });
    listTasks().then((r) => setTasks(r));
  }, [params.id]);

  const cancelEdit = () => {
    setTaskEdit(undefined);
    setParentId(undefined);
    setParentName(undefined);
  };

  const editTask = (t: TaskInterface) => {
    cancelEdit();
    setTaskEdit(t);
  };

  const addSubTask = (t: TaskInterface) => {
    cancelEdit();
    setParentId(t.task_id);
    setParentName(t.name);
  };

  return (
    <div id="todo-detail" className="container-fluid">
      <div className="row content-header">
        <div className="col-sm-10">
          <h2>
            <i className="bi bi-arrow-left" onClick={() => navigate(-1)} /> {todo?.name}
          </h2>
        </div>
        {todo && !shared ? (
          <div className="col-sm-2 text-end">
            <i className="bi bi-share-fill" onClick={() => setShowShareModal(true)} />
          </div>
        ) : null}
      </div>
      <div className="row">
        <div className="col-sm-12">
          <TaskForm
            todo_id={parseInt(params.id || '', 10)}
            task={taskEdit}
            parent_id={parentId}
            parent_name={parentName}
            reload={() => listTasks().then((r) => setTasks(r))}
            cancel={cancelEdit}
          />
        </div>
      </div>

      <TaskTable
        tasks={tasks}
        reload={() => listTasks().then((r) => setTasks(r))}
        addSubTask={addSubTask}
        edit={editTask}
      />

      {todo && !shared ? (
        <ShareModal
          show={showShareModal}
          todo={todo}
          onHidePress={() => setShowShareModal(false)}
        />
      ) : null}
    </div>
  );
};

export default TodoDetail;

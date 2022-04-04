import React from 'react';
import classNames from 'classnames';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import TaskInterface from '../Interfaces/task.interface';

import { useAuth } from '../Contexts/auth';

import TodoService from '../Services/todo.service';
const todoService = new TodoService();

const TaskTable: React.FC<{
  tasks: TaskInterface[];
  reload: Function;
  edit: Function;
  addSubTask: Function;
}> = ({ tasks, reload, edit, addSubTask }) => {
  const { user } = useAuth();

  const [progress, setProgress] = React.useState<number>(0);

  React.useEffect(() => {
    let total = 0;
    let check = 0;
    tasks.forEach((t) => {
      total += 1;
      check += t.checked ? 1 : 0;
      t.tasks?.forEach((st) => {
        total += 1;
        check += st.checked ? 1 : 0;
      });
    });
    setProgress(Math.round((check * 100) / total));
  }, [tasks]);

  const checkOrUncheck = (task_id: number, checked: boolean) => {
    todoService.updateTask(task_id, { checked }).then(() => {
      reload();
    });
  };

  const onDragEnd = (result: any) => {
    const task_id = result.draggableId.split('-')[1];
    const destiny_id = result.destination?.droppableId.split('-')[1];
    if (destiny_id && result.source.droppableId !== result.destination.droppableId) {
      const parent_id = destiny_id === 'moveup' ? null : destiny_id;
      todoService.updateTask(task_id, { parent_id }).then(() => {
        reload();
      });
    }
  };

  const remove = (taskId: number) => {
    if (window.confirm('Deseja realmente remover esta tarefa?')) {
      todoService.removeTask(taskId).then(() => {
        reload();
      });
    }
  };

  return (
    <div id="task-table" className="row">
      <div className="col-sm-12">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 text-center flex-center">
              <div className="progress task-progress">
                <div
                  className={classNames({ 'progress-bar': true, 'bg-success': progress >= 100 })}
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={25}
                  aria-valuemin={0}
                  aria-valuemax={100}>
                  {progress}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="col-sm-12">
          <div className="container-fluid task-header">
            <div className="row">
              <div className="col-sm-5">
                <strong>Tarefa</strong>
              </div>
              <div className="col-sm-2 text-center">
                <strong>Usuário</strong>
              </div>
              <div className="col-sm-2 text-center">
                <strong>Prazo</strong>
              </div>
              <div className="col-sm-1 text-center">
                <strong>Status</strong>
              </div>
              <div className="col-sm-2 text-center">
                <strong>Ações</strong>
              </div>
            </div>
          </div>
          {tasks.map((t, t_index) => (
            <Droppable key={`droppable${t.task_id}`} droppableId={`droppable-${t.task_id}`}>
              {(providedDroppable) => (
                <div
                  className="container-fluid task-container"
                  {...providedDroppable.droppableProps}
                  ref={providedDroppable.innerRef}>
                  <Draggable
                    key={`task-${t.task_id}`}
                    draggableId={`task-${t.task_id}`}
                    index={t_index}>
                    {(providedDraggableTask) => (
                      <div
                        className="row task-row"
                        style={{ border: 'solid 1px pink' }}
                        ref={providedDraggableTask.innerRef}
                        {...providedDraggableTask.draggableProps}
                        {...providedDraggableTask.dragHandleProps}>
                        <div className="col-sm-5">{t.name}</div>
                        <div className="col-sm-2 text-center">
                          {user?.user_id === t.user.user_id ? 'Eu' : t.user?.name}
                        </div>
                        <div className="col-sm-2 text-center">
                          {t.deadline.split('-').reverse().join('/')}
                        </div>
                        <div className="col-sm-1 text-center">
                          <input
                            type="checkbox"
                            checked={t.checked}
                            onChange={(v) => checkOrUncheck(t.task_id, v.target.checked)}
                          />
                        </div>
                        <div className="col-sm-2 text-end actions">
                          <i
                            className="bi bi-plus-circle"
                            title="Adicionar Sub Tarefa"
                            onClick={() => addSubTask(t)}
                          />
                          <i className="bi bi-pencil" title="Editar" onClick={() => edit(t)} />
                          <i
                            className="bi bi-trash"
                            title="Remover"
                            onClick={() => remove(t.task_id)}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                  {t.tasks?.length ? (
                    <>
                      {t.tasks.map((st, st_index) => (
                        <Draggable
                          key={`subtask-${st.task_id}`}
                          draggableId={`subtask-${st.task_id}`}
                          index={st_index}>
                          {(providedDraggableSubTask) => (
                            <div
                              className="row subtask-row justify-content-end"
                              ref={providedDraggableSubTask.innerRef}
                              {...providedDraggableSubTask.draggableProps}
                              {...providedDraggableSubTask.dragHandleProps}>
                              <div className="col-sm-4 subtask-name">{st.name}</div>
                              <div className="col-sm-2 text-center">
                                {user?.user_id === st.user.user_id ? 'Eu' : st.user?.name}
                              </div>
                              <div className="col-sm-2 text-center">
                                {st.deadline.split('-').reverse().join('/')}
                              </div>
                              <div className="col-sm-1 text-center">
                                <input
                                  type="checkbox"
                                  checked={st.checked}
                                  onChange={(v) => checkOrUncheck(st.task_id, v.target.checked)}
                                />
                              </div>
                              <div className="col-sm-2 text-end actions">
                                <i
                                  className="bi bi-pencil"
                                  title="Editar"
                                  onClick={() => edit(st)}
                                />
                                <i
                                  className="bi bi-trash"
                                  title="Remover"
                                  onClick={() => remove(st.task_id)}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </>
                  ) : null}
                  {providedDroppable.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          {!tasks.length && (
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <br />
                  Ainda não foi inserida nenhuma tarefa
                </div>
              </div>
            </div>
          )}
          {tasks.length ? (
            <Droppable key="droppable-moveup" droppableId="droppable-moveup">
              {(providedDroppable) => (
                <div
                  className="container-fluid"
                  {...providedDroppable.droppableProps}
                  ref={providedDroppable.innerRef}>
                  <div className="row">
                    <div id="moveup" className="col-sm-12">
                      Arraste a sub-tarefa para cá para transformá-la em tarefa principal
                    </div>
                  </div>
                  {providedDroppable.placeholder}
                </div>
              )}
            </Droppable>
          ) : null}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskTable;

import UserInterface from './user.interface';

interface TaskChildInterface {
  task_id: number;
  parent_id?: number;
  todo_id: number;
  name: string;
  deadline: string;
  checked: boolean;
  user: UserInterface;
}

export interface TaskUpdateInterface {
  parent_id?: number;
  name?: string;
  deadline?: string;
  checked?: boolean;
}

export default interface TaskInterface {
  task_id: number;
  parent_id?: number;
  todo_id: number;
  name: string;
  deadline: string;
  checked: boolean;
  user: UserInterface;
  tasks?: TaskChildInterface[];
}

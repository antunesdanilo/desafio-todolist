import UserInterface from './user.interface';

export default interface SharingInterface {
  sharing_id: number;
  user_shared_id: number;
  todo_id: number;
  user_shared?: UserInterface;
}

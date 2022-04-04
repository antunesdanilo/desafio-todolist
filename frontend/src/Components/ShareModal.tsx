import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle } from 'react-bootstrap';

import TodoInterface from '../Interfaces/todo.interface';
import SharingInterface from '../Interfaces/sharing.interface';

import UserInterface from '../Interfaces/user.interface';

import UserService from '../Services/user.service';
import SharingService from '../Services/sharing.service';

const sharingService = new SharingService();
const userService = new UserService();

const ShareModal: React.FC<{ show: boolean; todo: TodoInterface; onHidePress: Function }> = ({
  show,
  todo,
  onHidePress
}) => {
  const [users, setUsers] = React.useState<UserInterface[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<UserInterface[]>([]);

  const [keyword, setKeywork] = React.useState<string>('');

  const [sharings, setSharings] = React.useState<SharingInterface[]>([]);

  const getUsers = async () => {
    const response = userService.list();
    return response as any as UserInterface[];
  };

  const filterUsers = (k: string) => {
    setKeywork(k);
    if (k.length < 3) {
      return setFilteredUsers([]);
    }
    setFilteredUsers(users.filter((u) => u.name.toLowerCase().indexOf(k.toLowerCase()) > -1));
  };

  const list = async () => {
    const response = sharingService.list(todo.todo_id);
    return response as any as SharingInterface[];
  };

  const add = async (user: UserInterface) => {
    const exists = sharings.find((s) => s.user_shared_id === user.user_id);
    if (!exists) {
      await sharingService.add({
        user_shared_id: user.user_id,
        todo_id: todo.todo_id,
        sharing_id: 0
      });
      list().then((s) => setSharings(s));
    }
    setKeywork('');
    setFilteredUsers([]);
  };

  const remove = async (sharing: SharingInterface) => {
    if (window.confirm('Deseja realmente remover este compartilhamento?')) {
      await sharingService.remove(sharing.sharing_id);
      list().then((s) => setSharings(s));
    }
  };

  React.useEffect(() => {
    getUsers().then((u) => setUsers(u));
    list().then((s) => setSharings(s));
  }, [todo]);

  return (
    <Modal size="lg" show={show} onHide={() => onHidePress()}>
      <ModalHeader closeButton>
        <ModalTitle>Compartilhamentos de: {todo.name}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <input
          type="text"
          className="form-control"
          placeholder="Pesquise pelo nome do usuário"
          value={keyword}
          onChange={(v) => filterUsers(v.target.value)}
        />
        {filteredUsers.length ? (
          <ul className="list-group" style={{ marginTop: '1px' }}>
            {filteredUsers.map((u) => (
              <li className="list-group-item" key={u.user_id} onClick={() => add(u)}>
                {u.name}
              </li>
            ))}
          </ul>
        ) : null}
        <table className="table table-bordered" style={{ marginTop: '10px' }}>
          <thead>
            <tr>
              <td>Usuário</td>
              <td>&nbsp;</td>
            </tr>
          </thead>
          <tbody>
            {sharings.map((s) => (
              <tr key={s.sharing_id}>
                <td width="90%">{s.user_shared?.name}</td>
                <td className="td-center" width="10%">
                  <i onClick={() => remove(s)} className="bi bi-trash" title="Remover" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ModalBody>
      <ModalFooter>This is the footer</ModalFooter>
    </Modal>
  );
};

export default ShareModal;

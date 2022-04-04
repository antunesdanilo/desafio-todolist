import BaseService from './base.service';

import UserInterface from '../Interfaces/user.interface';

export default class UserService extends BaseService {
  register(form: UserInterface): Promise<Response> {
    return this.post('/user', form);
  }

  list(): Promise<Response> {
    return this.get('/users');
  }

  view(): Promise<Response> {
    return this.get('/user');
  }
}

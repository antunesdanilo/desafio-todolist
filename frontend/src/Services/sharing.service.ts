import BaseService from './base.service';

import SharingInterface from '../Interfaces/sharing.interface';

export default class SharingService extends BaseService {
  list(todoId: number): Promise<Response> {
    return this.get(`/sharing?todo_id=${todoId}`);
  }

  add(form: SharingInterface): Promise<Response> {
    return this.post('/sharing', form);
  }

  remove(id: number): Promise<Response> {
    return this.delete(`/sharing/${id}`);
  }
}

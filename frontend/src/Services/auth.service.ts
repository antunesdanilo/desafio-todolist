import BaseService from './base.service';

export default class AuthService extends BaseService {
  loginPassword(dados: Object): Promise<Response> {
    return this.post('/auth/login/password', dados);
  }

  loginToken(): Promise<Response> {
    return this.get('/auth/login/token');
  }

  logout(): Promise<Response> {
    return this.delete('/auth/logout');
  }
}

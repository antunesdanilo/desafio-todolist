import axios from 'axios';
import Cookies from 'universal-cookie';

import notifyService from './notify.service';

export default class BaseService {
  public cookies = new Cookies();

  public url: string = process.env.REACT_APP_API_HOST || 'http://localhost:3333';

  private axios: any;

  public headers = {};

  hasToken(): boolean {
    const cookie = this.cookies.get('api-token');
    return !!cookie;
  }

  setCookie(name: string, value: string, expires: Date): void {
    this.cookies.set(name, value, { expires, sameSite: 'strict' });
  }

  async http(metodo: string, path: string, dados: any = null) {
    if (metodo !== 'get') {
      notifyService.loading();
    }
    const token = this.hasToken() ? `bearer ${this.cookies.get('api-token')}` : undefined;
    const headers: any = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers.Authorization = token;
    }
    this.axios = axios.create({
      baseURL: this.url,
      headers
    });
    try {
      const response = await this.axios({
        method: metodo,
        url: this.url + path,
        data: dados || {}
      });
      return this.handle(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  handle(resposta: any) {
    if (resposta.data.data) {
      return resposta.data.data;
    }
    if ([201, 204].includes(resposta.status)) {
      return;
    }
    return this.handleError(resposta);
  }

  handleError(error: any) {
    let e: any;
    if (error.response) {
      if (error.response.data.errors) {
        [e] = error.response.data.errors;
      } else {
        e = error.response.data;
      }
    } else {
      e = error.data;
    }
    if (
      window.location.pathname !== '/login' &&
      (e.code === 401 || e.message === 'E_UNAUTHORIZED_ACCESS: Unauthorized access')
    ) {
      window.location.replace('/login');
    }
    notifyService.loaded('error', e.message);
    return Promise.reject(e);
  }

  // Requisições de consulta
  get(path: string): Promise<Response> {
    return this.http('get', path);
  }

  // Requisições de Inserção
  post(path: string, dados: any = null): Promise<Response> {
    return this.http('post', path, dados).then((r) => {
      let msg;
      switch (path) {
        case '/auth/login/password':
          msg = '';
          break;
        default:
          msg = 'Inserido com sucesso';
      }
      notifyService.loaded('success', msg);
      return r;
    });
  }

  // Requisições de Atualização
  put(path: string, dados: any = null): Promise<Response> {
    return this.http('put', path, dados).then((r) => {
      notifyService.loaded('success', 'Atualizado com sucesso');
      return r;
    });
  }

  // Requisições de Remoção
  delete(path: string): Promise<Response> {
    return this.http('delete', path).then((r) => {
      let msg;
      switch (path) {
        case '/auth/logout':
          msg = '';
          break;
        default:
          msg = 'Removido com sucesso';
      }
      notifyService.loaded('success', msg);
      return r;
    });
  }
}

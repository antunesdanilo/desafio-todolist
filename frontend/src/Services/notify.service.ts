import { toast } from 'react-toastify';

class NotifyService {
  private loading_id: any | null = null;

  notify(type: 'info' | 'error' | 'success' | 'warning', text: string | null = null) {
    toast(text, {
      theme: 'colored',
      type
    });
  }

  warning(msg: string) {
    this.notify('warning', msg);
  }

  info(msg: string) {
    this.notify('info', msg);
  }

  success(message: string | null = null) {
    const text = message || 'Concluído com sucesso';
    this.notify('success', text);
  }

  error(message: string) {
    this.notify('error', message);
  }

  loading() {
    this.loading_id = toast.loading('Processando', {
      type: 'default'
    });
  }

  loaded(status: 'error' | 'success' | null = null, message: string = '') {
    if (this.loading_id) {
      setTimeout(() => {
        if (status === 'error') {
          return toast.update(this.loading_id, {
            isLoading: false,
            render: message || 'Houve um erro ao tentar processar a solicitação',
            theme: 'colored',
            type: toast.TYPE.ERROR,
            autoClose: 3000
          });
        }
        if (status === 'success') {
          return toast.update(this.loading_id, {
            isLoading: false,
            render: message || 'Sucesso',
            theme: 'colored',
            type: toast.TYPE.SUCCESS,
            autoClose: 3000
          });
        }
        toast.dismiss(this.loading_id);
        this.loading_id = null;
      }, 1000);
    }
  }
}

const notifyService = new NotifyService();
export default notifyService;

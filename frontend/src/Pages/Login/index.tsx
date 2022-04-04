import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../Contexts/auth';

const Login: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm();
  const { loginPassword } = useAuth();

  const login = async (form: Object) => {
    try {
      await loginPassword(form);
    } catch (error) {
      setValue('email', null);
      setValue('password', null);
    }
  };

  return (
    <div id="login" className="container">
      <form onSubmit={handleSubmit(login)}>
        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 text-center flex-center">
            <h2>Todo List</h2>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 text-center">
            <h3>Login</h3>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4">
            <input
              data-testid="email-login-field"
              {...register('email', { required: true })}
              type="form-control"
              className="form-control"
              placeholder="E-mail"
            />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4">
            <input
              data-testid="password-login-field"
              {...register('password', { required: true })}
              type="password"
              className="form-control"
              placeholder="Senha"
            />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 text-end">
            <button data-testid="login-button" type="submit" className="btn btn-primary">
              Logar
            </button>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 text-end">
            Ainda não possui uma conta?
            <br />
            Clique{' '}
            <Link to="/register" data-testid="link-to-register">
              aqui
            </Link>{' '}
            e cadastre-se!
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;

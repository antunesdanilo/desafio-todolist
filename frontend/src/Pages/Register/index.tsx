import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import UserService from '../../Services/user.service';
const userService = new UserService();

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const userRegister = async (form: any) => {
    userService.register(form).then(() => {
      navigate('/login');
    });
  };

  return (
    <div id="cadastro" className="container">
      <form onSubmit={handleSubmit(userRegister)}>
        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 text-center flex-center">
            <h2>Todo List</h2>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 text-center">
            <h3>Cadastro</h3>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4">
            <input
              data-testid="name-register-field"
              {...register('name', { required: true })}
              type="form-control"
              className="form-control"
              placeholder="Nome"
            />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4">
            <input
              data-testid="email-register-field"
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
              data-testid="password-register-field"
              {...register('password', { required: true, minLength: 5, maxLength: 20 })}
              type="password"
              className="form-control"
              placeholder="Senha"
            />
            <span id="password-alert">Entre 5 e 20 caracteres</span>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4">
            <input
              data-testid="password-confirm-register-field"
              {...register('passwordConfirm', { required: true, minLength: 5, maxLength: 20 })}
              type="password"
              className="form-control"
              placeholder="Confirmação da Senha"
            />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 text-end">
            <button data-testid="register-button" type="submit" className="btn btn-primary">
              Cadastrar
            </button>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 text-end">
            Já possui uma conta?
            <br />
            Clique <Link to="/login">aqui</Link> e faça login!
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;

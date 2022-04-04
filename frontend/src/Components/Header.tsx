import React from 'react';
import { Link, useMatch } from 'react-router-dom';

import classNames from 'classnames';

import Avatar from 'react-avatar';
import { useAuth } from '../Contexts/auth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const Match = (path: string) => {
    return useMatch({ path, end: path === '/' });
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to="/" id="link-logo">
            <h1>ToDoList</h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/"
                  className={classNames({ 'router-link': true, active: Match('/') })}
                  aria-current="page">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/todo"
                  className={classNames({ 'router-link': true, active: Match('/todo') })}
                  aria-current="page">
                  Tarefas
                </Link>
              </li>
            </ul>
            <div className="d-flex-start">
              <div className="avatar-container">
                <Avatar name={user?.name} size="35" round className="avatar" />
                <span className="name">{user?.name}</span>
                <button className="btn btn-outline-success" type="submit" onClick={logout}>
                  <i className="bi bi-box-arrow-right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

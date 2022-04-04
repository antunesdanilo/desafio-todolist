import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from './Contexts/auth';

import Splash from './Components/Splash';
import Header from './Components/Header';
import Footer from './Components/Footer';

import Home from './Pages/Home';

import TodoList from './Pages/Todo/List';
import TodoDetail from './Pages/Todo/Detail';
import TodoForm from './Pages/Todo/Form';

import Login from './Pages/Login';
import Register from './Pages/Register';

const AppRoutes: React.FC = () => {
  const { loading, authenticated } = useAuth();

  if (loading) {
    return <Splash />;
  }

  return (
    <div className="App">
      {authenticated && <Header />}
      <section id="secao-principal">
        <Routes>
          {authenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/todo">
                <Route path="" element={<TodoList />} />
                <Route path="new" element={<TodoForm />} />
                <Route path=":id/:url" element={<TodoDetail />} />
                <Route path="update/:id/:url" element={<TodoForm />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </section>
      {authenticated && <Footer />}
    </div>
  );
};

export default AppRoutes;

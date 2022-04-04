import React from 'react';

import UserInterface from '../Interfaces/user.interface';
import AuthContextInterface from '../Interfaces/auth.context.interface';

import AuthService from '../Services/auth.service';
const auth = new AuthService();

const AuthContext = React.createContext<AuthContextInterface>({} as AuthContextInterface);

const AuthProvider: React.FC = ({ children }) => {
  const [, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<UserInterface | null>(null);
  const [authenticated, setAuthenticated] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  function login(r: any): void {
    if (r.token) {
      const now = new Date();
      const expires = new Date(now.getTime() + 30 * 60 * 1000);
      setToken(r.token.token);
      auth.setCookie('api-token', r.token.token, expires);
    }
    setUser(r.user);
    setAuthenticated(true);
  }

  React.useEffect(() => {
    async function loginToken(): Promise<void> {
      if (await auth.hasToken()) {
        try {
          const response = await auth.loginToken();
          login(response);
        } finally {
          setLoading(false);
        }
      }
      setLoading(false);
    }
    loginToken();
  }, []);

  async function loginPassword(form: any): Promise<void> {
    const response = await auth.loginPassword(form);
    login(response);
  }

  async function logout(): Promise<void> {
    return auth.logout().then(() => {
      setToken(null);
      setAuthenticated(false);
      setTimeout(() => {
        setUser(null);
      }, 500);
    });
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        authenticated,
        user,
        loginPassword,
        logout
      }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}

export { AuthContext, AuthProvider, useAuth };

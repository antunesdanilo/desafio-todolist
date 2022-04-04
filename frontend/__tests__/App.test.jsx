import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

describe('App Component', () => {
  it('should render login page', async () => {
    await act(async () => render(<App />));
    const loginHeader = screen.getByText(/Login/i);
    expect(loginHeader).toBeInTheDocument();
  });

  it('should render register page', async () => {
    await act(async () => render(<App />));
    const linkToRegister = screen.getByText(/aqui/i);
    userEvent.click(linkToRegister);
    const registerHeader = screen.getByText(/Cadastro/i);
    expect(registerHeader).toBeInTheDocument();
  });
});

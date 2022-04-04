import UserInterface from './user.interface';

export default interface AuthContextInterface {
  loading: boolean;
  authenticated: boolean;
  user: UserInterface | null;
  // eslint-disable-next-line no-unused-vars
  loginPassword(form: any): Promise<void>;
  logout(): Promise<void>;
}

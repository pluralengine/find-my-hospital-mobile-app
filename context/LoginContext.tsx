import { createContext } from 'react';
import { AsyncStorage } from 'react-native';
import { KEYS } from '../storage';

const defaultUser = { email: '', name: '', hospitalId: 0 };

export default createContext({
  user: defaultUser,
  setUser: (user) => user,
  logout: () => null,
});

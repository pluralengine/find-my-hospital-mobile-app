import { createContext } from "react";
import { AsyncStorage } from "react-native";
import { KEYS } from '../storage';

const defaultUser = { email: "", name: "" };

export default createContext({
  user: defaultUser,
  setUser: (user) => user,
  logout: () => null,
});

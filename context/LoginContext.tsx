import { createContext } from "react";

const defaultUser = { email: "", name: "" };

export default createContext({
  user: defaultUser,
  setUser: (user) => user,
});

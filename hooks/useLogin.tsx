import { useContext } from "react";
import LoginContext from "../context/LoginContext";

function useLogin() {
  return useContext(LoginContext);
}

export default useLogin;

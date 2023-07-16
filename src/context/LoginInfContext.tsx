import { createContext, useReducer, FC, ReactNode, Dispatch } from "react";
import { LoginInf, loginInfInitial } from "../commons/model";
import * as Constants from "./constants";

type ContextType = {
  loginInf: LoginInf;
  dispatchLoginInf: Dispatch<any>;
};

type StateType = {
  loginInf: LoginInf;
};

type ActionType = {
  type: Constants.Types;
  payload: LoginInf;
};

export const LoginInfContext = createContext<ContextType>({
  loginInf: loginInfInitial,
  dispatchLoginInf: () => null,
});

const authReducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case Constants.ACT_SET_LOGIN_INF:
      return { loginInf: action.payload };
    case Constants.ACT_UNSET_LOGIN_INF:
      return { loginInf: loginInfInitial };
    default:
      return state;
  }
};

type Props = {
  children: ReactNode;
};

export const LoginInfContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    loginInf: loginInfInitial,
  });

  return (
    <LoginInfContext.Provider value={{ ...state, dispatchLoginInf: dispatch }}>
      {children}
    </LoginInfContext.Provider>
  );
};

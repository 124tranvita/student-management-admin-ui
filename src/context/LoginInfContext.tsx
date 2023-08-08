import {
  createContext,
  useReducer,
  FC,
  ReactNode,
  Dispatch,
  useEffect,
} from "react";
import { LoginInf, loginInfInitial } from "../commons/model";
import * as Constants from "./constants";

type ContextType = {
  loginInf: LoginInf;
  dispatchLoginInf: Dispatch<ActionType>;
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

  const getLoginInfFromSessionStorage = () => {
    try {
      return JSON.parse(sessionStorage.getItem("loginInf") || "");
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const loginInf = getLoginInfFromSessionStorage();

    if (loginInf) {
      dispatch({ type: Constants.ACT_SET_LOGIN_INF, payload: loginInf });
    }
  }, []);

  return (
    <LoginInfContext.Provider value={{ ...state, dispatchLoginInf: dispatch }}>
      {children}
    </LoginInfContext.Provider>
  );
};

import {
  createContext,
  useReducer,
  useEffect,
  FC,
  ReactNode,
  Dispatch,
} from "react";
import { UserInf, useInfInitial } from "../commons/model";
import * as Constants from "./constants";

type ContextType = {
  userInfo: UserInf;
  dispatchAuth: Dispatch<ActionType>;
};

type StateType = {
  userInfo: UserInf;
};

type ActionType = {
  type: Constants.Types;
  payload: UserInf;
};

export const AuthContext = createContext<ContextType>({
  userInfo: useInfInitial,
  dispatchAuth: () => null,
});

const authReducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case Constants.ACT_USER_LOGIN:
      sessionStorage.setItem("userInfo", JSON.stringify(action.payload));
      return { userInfo: action.payload };
    case Constants.ACT_USER_LOGOUT:
      sessionStorage.setItem("userInfo", "");
      return { userInfo: useInfInitial };
    default:
      return state;
  }
};

type Props = {
  children: ReactNode;
};

export const AuthContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    userInfo: useInfInitial,
  });

  const getUserInfoFromSessionStorage = () => {
    try {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "");
      return userInfo;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const userInfo = getUserInfoFromSessionStorage();

    if (userInfo) {
      dispatch({ type: Constants.ACT_USER_LOGIN, payload: userInfo });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatchAuth: dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

import {
  createContext,
  useReducer,
  useEffect,
  FC,
  ReactNode,
  Dispatch,
} from "react";
import { SigninToken, signinTokenInitial } from "../commons/model";
import * as Constants from "./constants";

type ContextType = {
  signinToken: SigninToken;
  dispatchAuth: Dispatch<ActionType>;
};

type StateType = {
  signinToken: SigninToken;
};

type ActionType = {
  type: Constants.Types;
  payload: SigninToken;
};

export const AuthContext = createContext<ContextType>({
  signinToken: signinTokenInitial,
  dispatchAuth: () => null,
});

const authReducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case Constants.ACT_USER_LOGIN:
      return { signinToken: action.payload };
    case Constants.ACT_USER_LOGOUT:
      return { signinToken: signinTokenInitial };
    default:
      return state;
  }
};

type Props = {
  children: ReactNode;
};

export const AuthContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    signinToken: signinTokenInitial,
  });

  const getSigninTokenFromLocalStorage = () => {
    try {
      const accessToken = JSON.parse(
        sessionStorage.getItem("accessToken") || ""
      );
      const refreshToken = JSON.parse(
        sessionStorage.getItem("refreshToken") || ""
      );

      return { accessToken, refreshToken };
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const signinToken = getSigninTokenFromLocalStorage();

    if (signinToken) {
      dispatch({ type: Constants.ACT_USER_LOGIN, payload: signinToken });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatchAuth: dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

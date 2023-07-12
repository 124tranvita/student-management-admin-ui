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
  dispatch: Dispatch<any>;
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
  dispatch: () => null,
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
      return JSON.parse(localStorage.getItem("signinToken") || "");
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

  console.log("AuthContext state: ", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

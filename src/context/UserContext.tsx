import { createContext, useReducer, FC, ReactNode, Dispatch } from "react";
import { User, userInitial } from "../commons/model";
import * as Constants from "./constants";

type ContextType = {
  user: User;
  dispatch: Dispatch<any>;
};

type StateType = {
  user: User;
};

type ActionType = {
  type: Constants.Types;
  payload: User;
};

export const UserContext = createContext<ContextType>({
  user: userInitial,
  dispatch: () => null,
});

const authReducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case Constants.ACT_SET_USER:
      return { user: action.payload };
    case Constants.ACT_UNSET_USER:
      return { user: userInitial };
    default:
      return state;
  }
};

type Props = {
  children: ReactNode;
};

export const UserContextProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: userInitial,
  });

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

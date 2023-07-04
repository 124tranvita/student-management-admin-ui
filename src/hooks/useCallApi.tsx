import { useReducer } from "react";
import { Response } from "../commons/model";
import * as Constants from "./constants";

type StateType<T> = {
  isLoading: boolean;
  error: object | null;
  response: Response<T>;
};

type ActionType<T> = {
  type: Constants.Types;
  payload: Response<T>;
  error: object | null;
};

const useCallApiReducer = <T,>(
  state: StateType<T>,
  action: ActionType<T>
): StateType<T> => {
  switch (action.type) {
    case Constants.ACT_API_SUCCESS:
      return {
        ...state,
        isLoading: false,
        response: action.payload,
        error: action.error,
      };
    case Constants.ACT_API_REQUEST:
      return {
        ...state,
        isLoading: true,
        response: action.payload,
        error: action.error,
      };
    case Constants.ACT_API_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

const useCallApi = <T,>(initData: T) => {
  const [state, dispatch] = useReducer(useCallApiReducer<T>, {
    isLoading: false,
    error: null,
    response: {
      status: "",
      result: "",
      data: initData as T,
    },
  });

  const callApi = async (path: string, options: object) => {
    try {
      // const URL = import.meta.env.VITE_API_BASE_URL + path;
      const URL = import.meta.env.VITE_API_BASE_URL_LOCAL + path;
      console.log({ URL });

      dispatch({
        type: Constants.ACT_API_REQUEST,
        payload: {
          status: "",
          result: "",
          data: initData as T,
        },
        error: null,
      });

      const response = await fetch(URL, options);

      if (!response.ok) {
        const error = await response.json();

        dispatch({
          type: Constants.ACT_API_FAILURE,
          payload: {
            status: "",
            result: "",
            data: initData as T,
          },
          error: error,
        });
      }

      const data = await response.json();

      dispatch({
        type: Constants.ACT_API_SUCCESS,
        payload: data,
        error: null,
      });
    } catch (error) {
      console.log({ error });
    }
  };

  return {
    callApi,
    response: state.response,
    isLoading: state.isLoading,
    error: state.error,
  };
};

export default useCallApi;

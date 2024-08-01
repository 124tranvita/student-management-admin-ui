import { useReducer } from "react";
import { Error } from "../commons/model";
import * as Constants from "./constants";
import { useRefreshToken } from "./useRefreshToken";

type StateType<T> = {
  isLoading: boolean;
  error: Error | null;
  response: T;
};

type ActionType<T> = {
  type: Constants.Types;
  payload: T;
  error: Error | null;
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
  const { refreshAccessToken } = useRefreshToken();
  const [state, dispatch] = useReducer(useCallApiReducer<T>, {
    isLoading: false,
    error: null,
    response: initData as T,
  });

  const callApi = async (path: string, options: object) => {
    try {
      // const URL = import.meta.env.VITE_API_BASE_URL + path;
      const URL = import.meta.env.VITE_API_BASE_URL_LOCAL + path;
      console.log({ URL });

      dispatch({
        type: Constants.ACT_API_REQUEST,
        payload: state.response,
        error: null,
      });

      let response = await fetch(URL, options);

      // Check if the token is expired
      if (response.status === 401) {
        // Token expired, refresh the token
        const newAccessToken = await refreshAccessToken();

        // Retry the original request with the new access token
        response = await fetch(URL, {
          ...options,
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      const data = await response.json();
      // Set the response
      dispatch({
        type: Constants.ACT_API_SUCCESS,
        payload: data,
        error: null,
      });
    } catch (error: unknown | Error) {
      console.error({ error });
      // Set the error
      dispatch({
        type: Constants.ACT_API_FAILURE,
        payload: state.response,
        error: error as Error,
      });
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

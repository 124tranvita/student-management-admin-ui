import { Dispatch } from "react";
import { LoginInf } from "../../commons/model";
import { ACT_SET_LOGIN_INF } from "../../context/constants";
import * as Constants from "../../context/constants";
import { isNotNullData, isResponseSuccessfully } from "../../commons/utils";

type ActionType = {
  type: Constants.Types;
  payload: LoginInf;
};

export const getProfile = async (
  refreshToken: string,
  dispatch: Dispatch<ActionType>
) => {
  try {
    const URL = `${import.meta.env.VITE_API_BASE_URL_LOCAL}auth/profile`;

    const response = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = await response.json();

    if (isResponseSuccessfully(data) && isNotNullData(data.data)) {
      sessionStorage.setItem("loginInf", JSON.stringify(data.data));
      dispatch({ type: ACT_SET_LOGIN_INF, payload: data.data });
    }
  } catch (error) {
    console.log({ error });
  }
};

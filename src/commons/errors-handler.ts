import { Dispatch } from "react";
import { ACT_USER_LOGIN } from "../context/constants";

export const statusCode401Handler = async (
  refreshToken: string,
  dispatch: Dispatch<any>
) => {
  try {
    const URL = `${import.meta.env.VITE_API_BASE_URL_LOCAL}auth/refresh`;

    const response = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = await response.json();

    dispatch({ type: ACT_USER_LOGIN, payload: data });
  } catch (error) {
    console.log({ error });
  }
};

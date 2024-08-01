import { useCallback, useState } from "react";
import jwt_decode from "jwt-decode";
import { Decoded } from "../commons/model";
import { useAuthContext } from "./useAuthContext";
import * as Constants from "../context/constants";

export const useRefreshToken = () => {
  const { dispatchAuth } = useAuthContext();
  const [userInfo] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("userInfo") || "");
    } catch (error) {
      return null;
    }
  });

  const refreshAccessToken = useCallback(async () => {
    const URL = `${import.meta.env.VITE_API_BASE_URL_LOCAL}auth/refresh`;
    try {
      if (!userInfo) return "";

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo.tokens.refreshToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userInfo.info.sub,
          refreshToken: userInfo.tokens.refreshToken,
        }),
      });

      const data = await response.json();

      const decoded: Decoded = jwt_decode(data.data.accessToken);

      const payload = {
        info: decoded,
        tokens: data.data,
      };

      dispatchAuth({
        type: Constants.ACT_USER_LOGIN,
        payload: payload,
      });

      sessionStorage.setItem("userInfo", JSON.stringify(payload));

      return data.data.accessToken;
    } catch (error) {
      console.error({ error });
    }
  }, [dispatchAuth, userInfo]);

  return { refreshAccessToken };
};

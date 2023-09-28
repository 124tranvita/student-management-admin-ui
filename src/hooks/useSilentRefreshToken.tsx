import { useCallback, useEffect, useRef } from "react";
import * as Constants from "../context/constants";
import {
  refreshToken,
  authenitcated,
  sendRefreshToken,
  getProfile,
} from "../components/auth/utils";
import { SigninToken } from "../commons/model";
import { useLoginInfContext } from "./useLoginInfContext";

type AuthActionType = {
  type: Constants.Types;
  payload: SigninToken;
};

export const useSilentRefreshToken = (
  token: string,
  expiry: number,
  dispatchAuth: React.Dispatch<AuthActionType>
) => {
  const { dispatchLoginInf } = useLoginInfContext();
  const intervalRef = useRef<number>();
  const isRunnedRef = useRef<boolean>(false);

  const clearRefInterval = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (isRunnedRef.current) return;

    const silentRefreshTkn = async () => {
      const result = await refreshToken(token);

      if (!result) return;

      authenitcated(result, dispatchAuth);
      getProfile(result.accessToken, dispatchLoginInf);

      intervalRef.current = setInterval(() => {
        sendRefreshToken(dispatchAuth);
      }, expiry);
    };

    if (token) {
      silentRefreshTkn();
      isRunnedRef.current = true;
    }
  }, [token, dispatchAuth, expiry, dispatchLoginInf]);

  return { clearRefInterval };
};

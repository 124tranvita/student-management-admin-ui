import { useCallback } from "react";
import useCallApi from "../../../hooks/useCallApi";
import { useAuthContext } from "../../../hooks/useAuthContext";

const useCallMentorApi = <T,>(initData: T) => {
  const { userInfo } = useAuthContext();
  const { callApi, response, isLoading, error } = useCallApi<T>(initData);

  const callApiOnInit = useCallback(
    (limit: number) => {
      callApi(`mentor?id=${userInfo.info.sub}&role=0&page=1&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo.tokens.accessToken}`,
        },
      });
    },
    [callApi, userInfo.info.sub, userInfo.tokens.accessToken]
  );

  const callApiOnValueChange = useCallback(
    (page: number, limit: number, filter: string, queryString: string) => {
      callApi(
        `mentor?id=${userInfo.info.sub}&role=${filter}&page=${page}&limit=${limit}&queryString=${queryString}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.tokens.accessToken}`,
          },
        }
      );
    },
    [callApi, userInfo.info.sub, userInfo.tokens.accessToken]
  );

  const callApiOnPaging = useCallback(
    (page: number, limit: number, filter: string) => {
      callApi(
        `mentor?id=${userInfo.info.sub}&role=${filter}&page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.tokens.accessToken}`,
          },
        }
      );
    },
    [callApi, userInfo.info.sub, userInfo.tokens.accessToken]
  );

  const callApiOnCreate = useCallback(
    <T,>(data: T) => {
      callApi("mentor", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo.tokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    [callApi, userInfo.tokens.accessToken]
  );

  const callApiOnUpdate = useCallback(
    <T,>(id: string, data: T) => {
      callApi(`mentor/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${userInfo.tokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    [callApi, userInfo.tokens.accessToken]
  );

  const callApiOnDelete = useCallback(
    (id: string) => {
      callApi(`mentor/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.tokens.accessToken}`,
        },
      });
    },
    [callApi, userInfo.tokens.accessToken]
  );

  return {
    response,
    isLoading,
    error,
    callApiOnInit,
    callApiOnValueChange,
    callApiOnPaging,
    callApiOnCreate,
    callApiOnUpdate,
    callApiOnDelete,
  };
};

export default useCallMentorApi;

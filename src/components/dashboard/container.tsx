import { FC, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ComponentLoader,
  NavigatePanel,
  Wrapper,
} from "../../commons/components";
import { useAuthContext } from "../../hooks/useAuthContext";
import useCallApi from "../../hooks/useCallApi";
import { LoginInf, loginInfInitial } from "../../commons/model";
import * as ActionType from "../../context/constants";
import {
  isHttpStatusCode401,
  isNotNullData,
  isResponseSuccessfully,
} from "../../commons/utils";
import { statusCode401Handler } from "../../commons/errors-handler";
import useTitle from "../../hooks/useTitle";
import { useLoginInfContext } from "../../hooks/useLoginInfContext";
import UserInfo from "./user-info";

const Dashboard: FC = () => {
  const { setTitle } = useTitle();
  const { signinToken, dispatchAuth } = useAuthContext();
  const { dispatchLoginInf } = useLoginInfContext();
  const { callApi, response, isLoading, error } =
    useCallApi<LoginInf>(loginInfInitial);

  useEffect(() => {
    setTitle("Dashboard");
    console.log({ token: signinToken.accessToken });
    callApi(`auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${signinToken.accessToken}`,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signinToken.accessToken]);

  /** Check API response and set mentors data base on event type*/
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      dispatchLoginInf({
        type: ActionType.ACT_SET_LOGIN_INF,
        payload: response.data,
      });
    } else {
      if (error && isHttpStatusCode401(error)) {
        statusCode401Handler(signinToken.refreshToken, dispatchAuth);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

  /** Set component loading screen*/
  const isComponentLoading = useMemo(() => {
    return false;
    // return (
    //   isLoading &&
    //   ((isLoading && eventId === Constants.EventId.Add) ||
    //     eventId === Constants.EventId.Update ||
    //     eventId === Constants.EventId.Delete ||
    //     eventId === Constants.EventId.Paging)
    // );
  }, [isLoading]);

  return (
    <Wrapper>
      {/* Left Panel */}
      <div className="relative w-1/4">
        <NavigatePanel path={[]} />
        <UserInfo accessToken={signinToken.accessToken} />
      </div>

      {/* Right Panel */}

      <div className="relative w-3/4 p-4 h-75vh">
        {isComponentLoading ? (
          <div className="relative h-full">
            <ComponentLoader />
          </div>
        ) : (
          <>
            <ul>
              <Link to={"/mentor"}>
                <li>Mentors</li>
              </Link>
              <Link to={"/classroom"}>
                <li>Classroom</li>
              </Link>
              <Link to={"/student"}>
                <li>Students</li>
              </Link>
              <Link to={"/assign/123"}>
                <li>Assign</li>
              </Link>
            </ul>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default Dashboard;

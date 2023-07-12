import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavigatePanel, Wrapper } from "../commons/components";
import { useAuthContext } from "../hooks/useAuthContext";
import useCallApi from "../hooks/useCallApi";
import { User, userInitial } from "../commons/model";
import { useUserContext } from "../hooks/useUserContext";
import * as ActionType from "../context/constants";
import { isNotNullData, isResponseSuccessfully } from "../commons/utils";

const Page: FC = () => {
  const { signinToken } = useAuthContext();
  const { dispatch } = useUserContext();
  const { callApi, response, isLoading, error } = useCallApi<User>(userInitial);

  console.log({ response });

  useEffect(() => {
    // setTitle("Mentors");
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
      dispatch({ type: ActionType.ACT_SET_USER, payload: response.data });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return (
    <Wrapper>
      {/* Left Panel */}
      <div className="relative w-1/4">
        <NavigatePanel path={[]} />
        {/* {mentor && (
          <>
            <MentorInfo mentor={mentor} />
            {mentor.roles === Role.Mentor &&
              mentor.status === Status.Active && (
                <>
                  <AssignPanel mentor={mentor} />
                </>
              )}
          </>
        )} */}
      </div>
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
    </Wrapper>
  );
};

export default Page;

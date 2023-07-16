import { FC, useEffect, useState } from "react";
import { Card, HashDiv, Typography } from "../../commons/components";
import {
  capitalize,
  getEduction,
  isHttpStatusCode401,
  isNotNullData,
  isResponseSuccessfully,
} from "../../commons/utils";
import { Mentor, mentorInitial } from "../../commons/model";
import useCallApi from "../../hooks/useCallApi";
import { useLoginInfContext } from "../../hooks/useLoginInfContext";
import { statusCode401Handler } from "../../commons/errors-handler";
import { useAuthContext } from "../../hooks/useAuthContext";

const UserInfo: FC = () => {
  const [user, setUser] = useState<Mentor>(mentorInitial);

  const { signinToken, dispatchAuth } = useAuthContext();
  const { loginInf } = useLoginInfContext();
  const { callApi, response, isLoading, error } =
    useCallApi<Mentor>(mentorInitial);

  console.log({ user });

  /** Get user in the init time */
  useEffect(() => {
    callApi(`mentor/${loginInf.sub}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${signinToken.accessToken}`,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signinToken.accessToken]);

  /** Check response */
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      setUser(response.data as Mentor);
    } else {
      if (error && isHttpStatusCode401(error)) {
        statusCode401Handler(signinToken.refreshToken, dispatchAuth);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return (
    <Card avatar={user.avatar}>
      <div className="mb-6">
        <Typography text={user.name} type="title" size="large" />
        <Typography text={user.email} type="description" />
        <Typography text={capitalize(user.roles)} type="muted" />
        <Typography
          text={`${getEduction(user.education)} ${user.specialized}`}
          type="muted"
        />
      </div>

      <div className="mb-6">
        <Typography
          text={`Assigned classrooms: ${user.assignedClassroom}/6`}
          type="muted"
        />
        <Typography
          text={`Assigned students: ${user.assignedStudent}/25`}
          type="muted"
        />
      </div>

      {user.languages[0] &&
        user.languages.map((item: string, index: number) => (
          <HashDiv key={index} value={item} />
        ))}
    </Card>
  );
};

export default UserInfo;

import { FC } from "react";
import { Mentor } from "../../commons/model";
import { Card, HashDiv, Typography } from "../../commons/components";
import { capitalize, getEduction } from "../../commons/utils";
import * as Constants from "../../commons/constants";

type MentorInfoProps = {
  mentor: Mentor;
};

const MentorInfo: FC<MentorInfoProps> = ({ mentor }) => {
  return (
    <Card avatar={mentor.avatar}>
      <div className="mb-6">
        <Typography text={mentor.name} type="title" size="large" />
        <Typography text={mentor.email} type="description" />
        <Typography text={capitalize(mentor.roles)} type="muted" />
        <Typography
          text={`${getEduction(mentor.education)} ${mentor.specialized}`}
          type="muted"
        />
      </div>
      {mentor.roles === Constants.Role.Mentor && (
        <div className="mb-6">
          <Typography
            text={`Assigned classrooms: ${mentor.assignedClassroom}/6`}
            type="muted"
          />
          <Typography
            text={`Assigned students: ${mentor.assignedStudent}/25`}
            type="muted"
          />
        </div>
      )}
      {mentor.languages[0] &&
        mentor.languages.map((item: string, index: number) => (
          <HashDiv key={index} value={item} />
        ))}
    </Card>
  );
};

export default MentorInfo;

import { FC } from "react";
import { Mentor } from "../../commons/model";
import { Card, HashDiv, Typography } from "../../commons/components";
import { capitalize, getEduction } from "../../commons/utils";

type MentorInfoProps = {
  mentor: Mentor;
};

const MentorInfo: FC<MentorInfoProps> = ({ mentor }) => {
  return (
    <Card avatar={mentor.avatar}>
      <div className="mb-3">
        <Typography text={mentor.name} type="title" size="large" />
        <Typography text={mentor.email} type="description" />
        <Typography text={capitalize(mentor.roles)} type="muted" />
        <Typography
          text={`${getEduction(mentor.education)} ${mentor.specialized}`}
          type="muted"
        />
      </div>
      {mentor.languages[0] &&
        mentor.languages.map((item: string, index: number) => (
          <HashDiv key={index} value={item} />
        ))}
    </Card>
  );
};

export default MentorInfo;

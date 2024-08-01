import { FC, useEffect, useMemo } from "react";
import { useSelectId } from "../../hooks/useSelectId";
import { Mentor } from "../../commons/model";
import { Card, HashDiv, Typography } from "../../commons/components";
import { capitalize, getEduction } from "../../commons/utils";
import * as Constants from "../../commons/constants";

type MentorInfoProps = {
  mentors: Mentor[];
};

const MentorInfo: FC<MentorInfoProps> = ({ mentors }) => {
  const { selectedId, setSelectedId } = useSelectId();

  console.log({ selectedId });

  const mentor = useMemo(() => {
    return mentors.find((item: Mentor) => item._id === selectedId);
  }, [mentors, selectedId]);

  useEffect(() => {
    if (!selectedId || !mentor) {
      setSelectedId(mentors[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentors, mentor]);

  if (!mentor) {
    return (
      <>
        <div>No data</div>
      </>
    );
  }

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

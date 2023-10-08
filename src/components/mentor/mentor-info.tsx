import { FC } from "react";
import { Mentor } from "../../commons/model";
import {
  CoverContainer,
  HashDiv,
  InfoContainer,
  Typography,
} from "../../commons/components";
import { capitalize, getEduction } from "../../commons/utils";
import { Role, Status } from "./constants";
import { AssignStudentPanel, AssingClassroomPanel } from "./assign-panel";

type MentorInfoProps = {
  mentor: Mentor;
};

const MentorInfo: FC<MentorInfoProps> = ({ mentor }) => {
  return (
    <>
      <InfoContainer
        cover={<CoverContainer avatar={mentor.avatar} />}
        info={
          <>
            <Typography text={mentor.name} type="title" size="large" />
            <Typography text={mentor.email} type="description" />
            <Typography text={capitalize(mentor.roles)} type="muted" />
            <Typography
              text={`${getEduction(mentor.education)} ${mentor.specialized}`}
              type="muted"
            />
          </>
        }
        assginedUpper={
          mentor.roles === Role.Mentor && mentor.status === Status.Active ? (
            <>
              <Typography
                text={`Assigned classrooms: ${mentor.assignedClassroom}/6`}
                type="muted"
              />
              <AssignStudentPanel mentor={mentor} />
            </>
          ) : (
            <Typography text={`Assign Panel is disabled`} type="muted" />
          )
        }
        assginedLower={
          mentor.roles === Role.Mentor &&
          mentor.status === Status.Active && (
            <>
              <Typography
                text={`Assigned students: ${mentor.assignedStudent}/25`}
                type="muted"
              />
              <AssingClassroomPanel mentor={mentor} />
            </>
          )
        }
        bottom={
          mentor.languages &&
          mentor.languages.length > 0 &&
          mentor.languages.map((item: string, index: number) => (
            <HashDiv key={index} value={item} />
          ))
        }
      />
    </>
  );
};

export default MentorInfo;

import { FC } from "react";
import { Classroom } from "../../commons/model";
import {
  CoverContainer,
  HashDiv,
  InfoContainer,
  Typography,
} from "../../commons/components";
import { capitalize } from "../../commons/utils";
import AssignPanel from "./assign-panel";

type ClassroomInfoProps = {
  classroom: Classroom;
};

const ClassroomInfo: FC<ClassroomInfoProps> = ({ classroom }) => {
  return (
    <>
      <InfoContainer
        cover={<CoverContainer cover={classroom.cover} />}
        info={
          <>
            <Typography text={classroom.name} type="title" size="large" />
            <Typography
              text={capitalize(classroom.description || "")}
              type="description"
            />
          </>
        }
        assginedUpper={
          <>
            <Typography
              text={`Assigned Mentors: ${classroom.assignedMentor}/6`}
              type="muted"
            />
            <AssignPanel classroom={classroom} />
            <Typography
              text={`Assigned students: ${classroom.assignedStudent}/25`}
              type="muted"
            />
          </>
        }
        bottom={
          classroom.languages[0] &&
          classroom.languages.map((item: string, index: number) => (
            <HashDiv key={index} value={item} />
          ))
        }
      />
    </>
  );
};
export default ClassroomInfo;

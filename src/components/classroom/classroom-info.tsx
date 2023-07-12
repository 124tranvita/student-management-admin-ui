import { FC } from "react";
import { Classroom } from "../../commons/model";
import { Card, HashDiv, Typography } from "../../commons/components";
import { capitalize } from "../../commons/utils";

type ClassroomInfoProps = {
  classroom: Classroom;
};

const ClassroomInfo: FC<ClassroomInfoProps> = ({ classroom }) => {
  return (
    <Card cover={classroom.cover}>
      <div className="mb-3">
        <Typography text={classroom.name} type="title" size="large" />
        <Typography
          text={capitalize(classroom.description || "")}
          type="description"
        />
      </div>
      <div className="mb-6">
        <Typography
          text={`Assigned Mentors: ${classroom.assignedMentor}/6`}
          type="muted"
        />
        <Typography
          text={`Assigned students: ${classroom.assignedStudent}/25`}
          type="muted"
        />
      </div>
      {classroom.languages[0] &&
        classroom.languages.map((item: string, index: number) => (
          <HashDiv key={index} value={item} />
        ))}
    </Card>
  );
};

export default ClassroomInfo;

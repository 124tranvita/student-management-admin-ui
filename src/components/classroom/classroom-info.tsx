import { FC } from "react";
import { Classroom } from "../../commons/model";
import { Card, HashDiv, Typography } from "../../commons/components";
import { capitalize } from "../../commons/utils";

type ClassroomInfoProps = {
  classroom: Classroom;
};

const ClassroomInfo: FC<ClassroomInfoProps> = ({ classroom }) => {
  return (
    <Card cover={classroom.image}>
      <div className="mb-3">
        <Typography text={classroom.name} type="title" size="large" />
        <Typography
          text={capitalize(classroom.description || "")}
          type="description"
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

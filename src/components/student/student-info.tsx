import { FC } from "react";
import { Student } from "../../commons/model";
import { Card, HashDiv, Typography } from "../../commons/components";
import { capitalize, getGender, getStatus } from "../../commons/utils";
import { dateFormatter } from "../../commons/time-func";

type StudentInfoProps = {
  student: Student;
};

const StudentInfo: FC<StudentInfoProps> = ({ student }) => {
  return (
    <Card avatar={student.avatar} cover={student.cover}>
      <div className="mb-3">
        <Typography text={capitalize(student.name)} type="title" size="large" />
        <Typography
          text={`${student.studentId.toLocaleUpperCase()} - ${getStatus(
            student.status
          )}`}
          type="muted"
          size="subtext"
        />
        <Typography
          text={`${dateFormatter(student.doB)} - ${getGender(student.gender)}`}
          type="muted"
          size="subtext"
        />
        <Typography text={student.address} type="muted" size="subtext" />
      </div>
      {student.languages[0] &&
        student.languages.map((item: string, index: number) => (
          <HashDiv key={index} value={item} />
        ))}
    </Card>
  );
};

export default StudentInfo;

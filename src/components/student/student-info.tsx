import { FC, useEffect, useState } from "react";
import { Student, Mentor, mentorInitial } from "../../commons/model";
import { Card, HashDiv, Typography } from "../../commons/components";
import {
  capitalize,
  getGender,
  getStatus,
  isNotNullData,
  isResponseSuccessfully,
} from "../../commons/utils";
import { dateFormatter } from "../../commons/time-func";
import useCallApi from "../../hooks/useCallApi";

type StudentInfoProps = {
  student: Student;
  accessToken: string;
};

const StudentInfo: FC<StudentInfoProps> = ({ student, accessToken }) => {
  const [mentor, setMentor] = useState<Mentor>();
  const { callApi, response, isLoading, error } = useCallApi<Mentor[] | Mentor>(
    [] || mentorInitial
  );

  /** Get student's mentor information */
  useEffect(() => {
    if (student.mentor) {
      callApi(`mentor/${student.mentor}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.mentor]);

  /** Check API response and set mentors data base on event type*/
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      setMentor(response.data as Mentor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

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

      {/* mentor information */}
      {student.mentor && mentor && (
        <div className="mb-3 py-4 border-t border-slate-200">
          <Typography
            text={`Assinged to ${capitalize(mentor.name)}`}
            type="title"
            size="normal"
          />
          <Typography text={mentor.email} type="muted" size="subtext" />
          <Typography
            text={getStatus(mentor.status)}
            type="muted"
            size="subtext"
          />
        </div>
      )}

      {student.languages[0] &&
        student.languages.map((item: string, index: number) => (
          <HashDiv key={index} value={item} />
        ))}
    </Card>
  );
};

export default StudentInfo;

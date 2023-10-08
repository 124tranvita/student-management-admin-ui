import { FC, useMemo, useState } from "react";
import { Icons } from "../../commons/components";
import { AssignModal } from "../../commons/components/modal";
import { Mentor } from "../../commons/model";
import AssignedStudentList from "./assigned-students";
import UnassignedStudentList from "./unassign-students";
import UnassignClassroomList from "./unassign-classroom";
import AssignedClassroomList from "./assigned-classroom";

type Props = {
  mentor: Mentor;
};

export const AssignStudentPanel: FC<Props> = ({ mentor }) => {
  const [isAssign, setIsAssign] = useState<boolean>(true);

  const data = useMemo(() => {
    return {
      title: isAssign
        ? `Mentor "${mentor.name}" assigned students`
        : `Unassigned students list`,
      component: isAssign ? (
        <AssignedStudentList mentorId={mentor._id} />
      ) : (
        <UnassignedStudentList mentorId={mentor._id} />
      ),
    };
  }, [isAssign, mentor]);

  return (
    <div className="mx-2 items-center">
      <AssignModal
        title={data.title}
        label="Students"
        isAssign={isAssign}
        setIsAssign={setIsAssign}
        icon={<Icons.ListStudentIcon />}
      >
        {data.component}
      </AssignModal>
    </div>
  );
};

export const AssingClassroomPanel: FC<Props> = ({ mentor }) => {
  const [isAssign, setIsAssign] = useState<boolean>(true);

  const data = useMemo(() => {
    return {
      title: isAssign
        ? `Mentor "${mentor.name}" assigned classrooms`
        : `Unassigned classrooms list`,
      component: isAssign ? (
        <AssignedClassroomList mentorId={mentor._id} />
      ) : (
        <UnassignClassroomList mentorId={mentor._id} />
      ),
    };
  }, [isAssign, mentor]);

  return (
    <div className="mx-2 items-center">
      <AssignModal
        title={data.title}
        label="Classrooms"
        isAssign={isAssign}
        setIsAssign={setIsAssign}
        icon={<Icons.ListClassroomIcon />}
      >
        {data.component}
      </AssignModal>
    </div>
  );
};

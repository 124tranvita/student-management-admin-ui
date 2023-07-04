import { FC, useState } from "react";
import { Icons } from "../../commons/components";
import { AssignModal } from "../../commons/components/modal";
import { Mentor } from "../../commons/model";
import AssignedStudentList from "./assigned-students";
import UnassignStudentList from "./unassign-students";
import UnassignClassroomList from "./unassign-classroom";

type AssignPanel = {
  mentor: Mentor;
};

const AssignPanel: FC<AssignPanel> = ({ mentor }) => {
  const [isAssign, setIsAssign] = useState<boolean>(true);

  const data = {
    studentTitle: isAssign
      ? `Mentor "${mentor.name}" assigned students`
      : `Unassigned students list`,
    studentComponent: isAssign ? (
      <AssignedStudentList mentorId={mentor._id} />
    ) : (
      <UnassignStudentList mentorId={mentor._id} />
    ),
    classroomTitle: isAssign
      ? `Mentor "${mentor.name}" assigned students`
      : `Unassigned students list`,
    classroomComponent: isAssign ? (
      <AssignedStudentList mentorId={mentor._id} />
    ) : (
      <UnassignClassroomList mentorId={mentor._id} />
    ),
  };

  return (
    <div className="flex flex-wrap w-full px-1 border-t border-gray-200 pt-6">
      <div className="mx-4 mb-3">
        <AssignModal
          title={data.studentTitle}
          label="Students"
          isAssign={isAssign}
          setIsAssign={setIsAssign}
          icon={<Icons.ListStudentIcon />}
        >
          {data.studentComponent}
        </AssignModal>
      </div>
      <div className="mx-4 mb-3">
        <AssignModal
          title="Assinged Classrooms"
          label="Classrooms"
          isAssign={isAssign}
          setIsAssign={setIsAssign}
          icon={<Icons.ListClassroomIcon />}
        >
          <UnassignClassroomList mentorId={mentor._id} />
        </AssignModal>
      </div>
    </div>
  );
};

export default AssignPanel;

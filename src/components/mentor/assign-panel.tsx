import { FC, useState } from "react";
import { Icons } from "../../commons/components";
import { AssignModal } from "../../commons/components/modal";
import { Mentor } from "../../commons/model";
import UnAssignedStudentList from "./unassign-students";
import AssignedStudentList from "./assign-students";

type AssignPanel = {
  mentor: Mentor;
};

const AssignPanel: FC<AssignPanel> = ({ mentor }) => {
  const [isUnassign, setIsUnassign] = useState<boolean>(false);

  const data = {
    studentTitle: isUnassign
      ? `Mentor "${mentor.name}" assigned students`
      : `Unassinged students list`,
    studentComponent: isUnassign ? (
      <UnAssignedStudentList mentorId={mentor.id} />
    ) : (
      <AssignedStudentList mentorId={mentor.id} />
    ),
  };

  return (
    <div className="flex flex-wrap w-full px-1 border-t border-gray-200 pt-6">
      <div className="mx-4 mb-3">
        <AssignModal
          title={data.studentTitle}
          label="Students"
          isUnassign={isUnassign}
          setIsUnassign={setIsUnassign}
          icon={<Icons.ListStudentIcon />}
        >
          {data.studentComponent}
        </AssignModal>
      </div>
      <div className="mx-4 mb-3">
        <AssignModal
          title="Assinged Classrooms"
          label="Classrooms"
          isUnassign={isUnassign}
          setIsUnassign={setIsUnassign}
          icon={<Icons.ListClassroomIcon />}
        >
          <h1>Hi General modal</h1>
        </AssignModal>
      </div>
    </div>
  );
};

export default AssignPanel;

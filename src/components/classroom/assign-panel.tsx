import { FC, useState } from "react";
import { Icons } from "../../commons/components";
import { AssignModal } from "../../commons/components/modal-old";
import { Classroom } from "../../commons/model";
import UnassignMentorList from "./unassign-mentors";
import AssignedMentorList from "./assigned-mentors";

type AssignPanel = {
  classroom: Classroom;
};

const AssignPanel: FC<AssignPanel> = ({ classroom }) => {
  const [isAssign, setIsAssign] = useState<boolean>(true);

  const data = {
    title: isAssign
      ? `Classroom "${classroom.name}" assigned mentors`
      : `Unassigned mentors list`,
    component: isAssign ? (
      <AssignedMentorList classroomId={classroom._id} />
    ) : (
      <UnassignMentorList classroomId={classroom._id} />
    ),
  };

  return (
    <div className="flex flex-wrap justify-evenly w-full px-1 border-t border-gray-200 pt-6">
      <div className="mx-2 mb-3">
        <AssignModal
          title={data.title}
          label="Mentors"
          isAssign={isAssign}
          setIsAssign={setIsAssign}
          icon={<Icons.ListStudentIcon />}
        >
          {data.component}
        </AssignModal>
      </div>
    </div>
  );
};

export default AssignPanel;

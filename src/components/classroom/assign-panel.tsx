import { FC, useState } from "react";
import { Icons } from "../../commons/components";
import { AssignModal } from "../../commons/components/modal";
import { Classroom } from "../../commons/model";
import UnassignedMentorList from "./unassign-mentors";
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
      <UnassignedMentorList classroomId={classroom._id} />
    ),
  };

  return (
    <div className="mx-2 items-center">
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
  );
};

export default AssignPanel;

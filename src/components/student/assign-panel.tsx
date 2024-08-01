import { FC, useState } from "react";
import { Icons } from "../../commons/components";
import { AssignModal } from "../../commons/components/modal-old";
import { Mentor, Student } from "../../commons/model";
import AssignedClassroomList from "./assigned-classroom";

type AssignPanel = {
  student: Student;
};

const AssignPanel: FC<AssignPanel> = ({ student }) => {
  const [isAssign, setIsAssign] = useState<boolean>(true);

  return (
    <div className="flex flex-wrap justify-evenly w-full px-1 border-t border-gray-200 pt-6">
      <div className="mx-2 mb-3">
        <AssignModal
          title={`${student.name}'s assigned classrooms`}
          label="Students"
          isAssign={isAssign}
          setIsAssign={setIsAssign}
          icon={<Icons.ListStudentIcon />}
        >
          <AssignedClassroomList studentId={student._id} />
        </AssignModal>
      </div>
    </div>
  );
};

export default AssignPanel;

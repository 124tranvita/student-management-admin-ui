import React from "react";
import AssignedClassroomList from "./assigned-classroom";
import UnassignClassroomList from "./unassign-classroom";

type Props = {
  id: string;
};

const ClassroomManagementPanel: React.FC<Props> = ({ id }) => {
  const [isAssign, setIsAssign] = React.useState<boolean>(true);
  return (
    <>
      {isAssign ? (
        <AssignedClassroomList mentorId={id} />
      ) : (
        <UnassignClassroomList mentorId={id} />
      )}
    </>
  );
};

export default ClassroomManagementPanel;

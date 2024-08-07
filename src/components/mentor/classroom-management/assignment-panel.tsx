import React from "react";
import AssignedClassroomList from "./assigned-classroom";
import UnassignClassroomList from "./unassign-classroom";
import { Buttons } from "../../../commons/components";
import { Modal } from "../../../commons/compound-components";

type Props = {
  id: string;
};

const ClassroomManagementPanel: React.FC<Props> = ({ id }) => {
  const [isAssign, setIsAssign] = React.useState<boolean>(true);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  return (
    <>
      <Buttons.Button
        type="button"
        label="Add"
        onClick={() => setIsOpen(!isOpen)}
        variant="primary"
      />
      <Modal.Wrapper isOpen={isOpen}>
        <>PANEL</>
        <button onClick={() => setIsOpen(!isOpen)}>Close</button>
        {/* {isAssign ? (
          <AssignedClassroomList mentorId={id} />
        ) : (
          <UnassignClassroomList mentorId={id} />
        )} */}
      </Modal.Wrapper>
    </>
  );
};

export default ClassroomManagementPanel;

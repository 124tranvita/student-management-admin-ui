import { FC, ReactNode } from "react";
import { EventId } from "../constants";
import Typography from "./typography";
import { AssignFormModal, UnassignFormModal } from "./modal-old";

type Props = {
  children: ReactNode;
};

export const AssignListWrapper: FC<Props> = ({ children }) => {
  return (
    <>
      <li className="flex justify-between items-center p-2 mb-2 rounded-md border border-slate-100 hover:shadow-sm hover:bg-slate-100 duration-300 hover:cursor-pointer">
        {children}
      </li>
    </>
  );
};

type UnAssignListItemControlProps = {
  handleUnAssign: () => void;
  setEventId: (value: EventId) => void;
  name: string;
};

export const UnAssignListItemControl: FC<UnAssignListItemControlProps> = ({
  handleUnAssign,
  setEventId,
  name,
}) => {
  return (
    <div className="flex justify-start items-center ">
      <div>
        <UnassignFormModal
          title="Confirm"
          handleSubmit={handleUnAssign}
          setEventId={setEventId}
        >
          <Typography
            text={`Unassign student "${name}"?`}
            type="name"
            size="normal"
          />
        </UnassignFormModal>
      </div>
    </div>
  );
};

type AssignListItemControlProps = {
  handleAssign: () => void;
  setEventId: (value: EventId) => void;
  name: string;
};

export const AssignListItemControl: FC<AssignListItemControlProps> = ({
  handleAssign,
  setEventId,
  name,
}) => {
  return (
    <div className="flex justify-start items-center ">
      <div>
        <AssignFormModal
          title="Confirm"
          handleSubmit={handleAssign}
          setEventId={setEventId}
        >
          <Typography text={`Assign "${name}"?`} type="name" size="normal" />
        </AssignFormModal>
      </div>
    </div>
  );
};

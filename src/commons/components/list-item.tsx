import { FC, ReactNode, useEffect, useState } from "react";
import { DeleteFormModal, UpdateFormModal } from "./modal";
import { AvatarImg } from "./images";
import Typography from "./typography";
import { compareObjectId } from "../utils";
import { EventId } from "../constants";

type ListItemWrapperProps = {
  children: ReactNode;
  id: string;
  selectedId: string;
  handleSelect: (value: string) => void;
};

export const ListItemWrapper: FC<ListItemWrapperProps> = ({
  children,
  id,
  selectedId,
  handleSelect,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (compareObjectId(id, selectedId)) {
      return setIsActive(true);
    }
    setIsActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return (
    <li
      onClick={() => handleSelect(id)}
      className={`${
        isActive ? "bg-slate-100" : ""
      } flex justify-between items-center p-2 mb-2 rounded-md border border-slate-100 hover:shadow-sm hover:bg-slate-100 duration-300 hover:cursor-pointer`}
    >
      {children}
    </li>
  );
};

type ListItemAvatarProps = {
  children: ReactNode;
  img: string;
};

export const ListItemAvatar: FC<ListItemAvatarProps> = ({ img, children }) => {
  return (
    <div className="flex justify-start items-center">
      <AvatarImg path={img} width="46" height="46" />
      <div className="flex-column">{children}</div>
    </div>
  );
};

type ListItemControlProps = {
  children: ReactNode;
  handleUpdate: () => void;
  handleRemove: () => void;
  setEventId: (value: EventId) => void;
  name: string;
};

export const ListItemControl: FC<ListItemControlProps> = ({
  children,
  handleRemove,
  handleUpdate,
  setEventId,
  name,
}) => {
  return (
    <div className="flex justify-start items-center ">
      <div className="mx-4">
        <UpdateFormModal
          title={`Update ${name}`}
          handleSubmit={handleUpdate}
          setEventId={setEventId}
        >
          {children}
        </UpdateFormModal>
      </div>
      <div>
        <DeleteFormModal
          title="Confirm"
          handleSubmit={handleRemove}
          setEventId={setEventId}
        >
          <Typography text={`Delete "${name}"?`} type="name" size="normal" />
        </DeleteFormModal>
      </div>
    </div>
  );
};

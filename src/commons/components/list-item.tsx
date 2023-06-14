import { FC, ReactNode } from "react";
import { DeleteFormModal, UpdateFormModal } from "./modal";
import { AvatarImg } from "./images";
import Typography from "./typography";

type ListItemWrapperProps = {
  children: ReactNode;
};

export const ListItemWrapper: FC<ListItemWrapperProps> = ({ children }) => {
  return (
    <li className="flex justify-between items-center p-2 mb-2 rounded-md border border-slate-100 hover:shadow-sm hover:bg-slate-100 duration-300">
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
  handleUpdate: (value: string) => void;
  handleRemove: (value: string) => void;
  id: string;
  name?: string;
};

export const ListItemControl: FC<ListItemControlProps> = ({
  children,
  handleRemove,
  handleUpdate,
  id,
  name,
}) => {
  return (
    <div className="flex justify-start items-center ">
      <div className="mx-4">
        <UpdateFormModal title="update" handleSubmit={() => handleUpdate(id)}>
          {children}
        </UpdateFormModal>
      </div>
      <div>
        <DeleteFormModal title="Confirm" handleSubmit={() => handleRemove(id)}>
          <Typography text={`Delete "${name}"?`} type="name" size="normal" />
        </DeleteFormModal>
      </div>
    </div>
  );
};

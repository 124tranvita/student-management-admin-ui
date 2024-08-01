import { FC, ReactNode, useCallback, useMemo } from "react";
import { useSelectId } from "../../hooks/useSelectId";
import { AvatarImg } from "./images";

type ListItemWrapperProps = {
  id: string;
  children: ReactNode;
};

export const ListItemWrapper: FC<ListItemWrapperProps> = ({ id, children }) => {
  const { selectedId, setSelectedId } = useSelectId();

  const handleSelect = useCallback(() => {
    setSelectedId(id);
  }, [setSelectedId, id]);

  const isActive = useMemo(() => {
    return id === selectedId;
  }, [id, selectedId]);

  return (
    <li
      onClick={handleSelect}
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
      <AvatarImg path={img} width="36" height="36" />
      <div className="flex-column">{children}</div>
    </div>
  );
};

type ListItemControlProps = {
  editNode: ReactNode;
  deleteNode: ReactNode;
};

export const ListItemControl: FC<ListItemControlProps> = ({
  editNode,
  deleteNode,
}) => {
  return (
    <div className="flex justify-start items-center ">
      <div className="mx-4">{editNode}</div>
      <div>{deleteNode}</div>
    </div>
  );
};

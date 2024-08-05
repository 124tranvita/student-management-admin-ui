import React from "react";
import { useSelectId } from "../../hooks/useSelectId";
import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
};

export const Wrapper: React.FC<Props> = ({ children }) => {
  return (
    <div className="overflow-y-auto">
      <ul className="h-full">{children}</ul>
    </div>
  );
};

type ItemProps = {
  id: string;
  renderThumbnail: () => React.ReactNode;
  renderBasicInfo: () => React.ReactNode;
  renderEditNode: () => React.ReactNode;
  renderDeleteNode: () => React.ReactNode;
};

export const Item: React.FC<ItemProps> = ({
  id,
  renderThumbnail,
  renderBasicInfo,
  renderEditNode,
  renderDeleteNode,
}) => {
  const { selectedId, setSelectedId } = useSelectId();

  const handleSelect = React.useCallback(() => {
    setSelectedId(id);
  }, [setSelectedId, id]);

  const isActive = React.useMemo(() => {
    return id === selectedId;
  }, [id, selectedId]);

  return (
    <li
      onClick={handleSelect}
      className={`${
        isActive ? "bg-slate-100" : ""
      } flex justify-between items-center p-2 mb-2 rounded-md border border-slate-100 hover:shadow-sm hover:bg-slate-100 duration-300 hover:cursor-pointer`}
    >
      <div className="grid grid-cols-[46px_2fr_1fr] gap-4 w-full">
        <div className="flex items-center w-full">{renderThumbnail()}</div>
        <div
          className={`flex justify-between items-center ${styles["list-basic-info"]}`}
          id="list-basic-info"
        >
          {renderBasicInfo()}
          <div></div>
        </div>
        <div className="flex justify-end items-center ">
          <div className="flex items-center mr-4">{renderEditNode()}</div>
          <div className="flex items-center mr-4">{renderDeleteNode()}</div>
        </div>
      </div>
    </li>
  );
};

import React, { ReactNode } from "react";
import { SelectIdProvider } from "../../../context/SelectIdContext";

type Props = {
  renderNavigate: () => ReactNode;
  renderTopControl: () => ReactNode;
  renderDetailInfo: () => ReactNode;
  renderItemList: () => ReactNode;
};

const BaseContainer: React.FC<Props> = (props) => {
  return (
    <>
      <SelectIdProvider>
        {/* left panel */}
        <>
          <div className="relative w-1/4 p-4">
            <div>{props.renderNavigate()}</div>
            <div>{props.renderDetailInfo()}</div>
          </div>
        </>
        {/* right panel */}
        <>
          <div className="relative w-3/4 p-4">
            <div className="flex justify-end w-full mb-3">
              {props.renderTopControl()}
            </div>
            <div className="flex flex-col justify-between min-h-full">
              <>{props.renderItemList()}</>
            </div>
          </div>
        </>
      </SelectIdProvider>
    </>
  );
};

export default BaseContainer;

import { FC, ReactNode } from "react";
import { Wrapper } from "../container";
import Typography from "../typography";

type Props = {
  navigation: () => ReactNode;
  placeholder: () => ReactNode;
};

const NoItemContainer: FC<Props> = (props) => {
  return (
    <Wrapper>
      <div className="w-full">
        <>{props.navigation()}</>
        <div className="flex flex-col text-center justify-center items-center place-items-center h-70vh bg-gray-100 rounded-md relative w-full p-4 mt-8">
          <div className="mb-3">
            <Typography
              type="name"
              text="There are no recorded yet. Please add one!"
            />
          </div>
          <div>{props.placeholder()}</div>
        </div>
      </div>
    </Wrapper>
  );
};

export default NoItemContainer;

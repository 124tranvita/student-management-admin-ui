import { FC } from "react";
import Typography from "../typography";

const NoItemContainer: FC = () => {
  return (
    <>
      <div className="w-full">
        <div className="flex flex-col text-center justify-center items-center place-items-center h-70vh bg-gray-100 rounded-md relative w-full p-4">
          <div className="mb-3">
            <Typography
              type="name"
              text="No results found. Please try again with different search criteria or add once."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default NoItemContainer;

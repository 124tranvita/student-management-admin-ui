import { FC } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from ".";

type Obj = {
  name: string;
  to: string;
  destiny: boolean;
};

type Path = {
  path: Obj[];
};

export const NavigatePanel: FC<Path> = ({ path }) => {
  return (
    <div className="absolute -top-6 left-4 z-50 w-full flex gap-2">
      <div>
        <Dropdown />
      </div>
      <div className="flex items-center border-b-2 border-white">
        {path &&
          path.map((item: Obj, index: number) => (
            <Link key={index} to={item.to}>
              <span
                className={`text-base ${
                  item.destiny
                    ? "text-slate-400 no-underline"
                    : "text-sky-500 underline"
                }`}
              >
                {`/ ${item.name}`}
              </span>
            </Link>
          ))}
      </div>
      <div className="absolute z-50"></div>
    </div>
  );
};

import { FC } from "react";
import { Link } from "react-router-dom";

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
    <div className="absolute -top-5 left-4">
      <Link to={"/"}>
        <span className="text-sky-500 underline">Dashboard</span>
        <span className="text-sky-500">{" / "}</span>
      </Link>
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
              {item.name}
            </span>
          </Link>
        ))}
    </div>
  );
};

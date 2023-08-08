import { ReactNode } from "react";
import { Link } from "react-router-dom";

type CardProps = {
  children: ReactNode;
  avatar?: string;
  cover?: string;
  path?: string;
};

const defaultCover =
  "https://img.freepik.com/premium-vector/modern-digital-futuristic-abstract-background-template_358261-24.jpg";

export const Card: React.FC<CardProps> = ({ children, avatar, cover }) => {
  return (
    <div className="p-4">
      <div className="relative max-w-sm rounded overflow-hidden">
        <img
          className="w-full h-card-classroom-img  object-cover"
          src={cover ? cover : defaultCover}
          alt="card cover"
        />
        {avatar && (
          <img
            className="absolute top-28 left-0 right-0 mx-auto rounded-full w-32 h-32"
            src={avatar}
            alt="card avatar"
            width="128"
            height="128"
          />
        )}

        <div className="pt-12">{children}</div>
      </div>
    </div>
  );
};

export const CardDashBoard: React.FC<CardProps> = ({
  children,
  cover,
  path = "/",
}) => {
  return (
    <div className="p-4 pt-0">
      <Link to={path}>
        <div className="relative w-96 h-card-classroom-img border border-b-slate-200 shadow-sm rounded overflow-hidden hover:shadow-md duration-300">
          <div className="w-full flex justify-end hover:drop-shadow-xl hover:scale-105 duration-300">
            <img
              className="-mr-24 h-card-classroom-img object-cover duration-300"
              src={cover}
              alt="card cover"
              width="350"
              height="350"
            />
          </div>
          <div className="absolute top-4 left-6 text-lg text-slate-600 font-semibold">
            {children}
          </div>
        </div>
      </Link>
    </div>
  );
};

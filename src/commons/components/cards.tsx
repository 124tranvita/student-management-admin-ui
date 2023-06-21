import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  avatar: string;
};

export const Card: React.FC<CardProps> = ({ children, avatar }) => {
  return (
    <div className="p-4">
      <div className="relative max-w-sm rounded overflow-hidden">
        <img
          className="w-full h-card-classroom-img  object-cover"
          src="https://img.freepik.com/premium-vector/cloud-blue-heaven-sunny-summer-day-cloudy-nature-morning-scene-with-falling-star_461812-64.jpg"
          alt="Sunset in the mountains"
        />
        <img
          className="absolute top-28 left-0 right-0 mx-auto rounded-full w-32 h-32"
          src={avatar}
          alt="mentor avatar"
          width="128"
          height="128"
        />
        <div className="pt-12">{children}</div>
      </div>
    </div>
  );
};

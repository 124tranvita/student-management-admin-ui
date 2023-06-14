import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  cover: string;
};

export const Card: React.FC<CardProps> = ({ children, cover }) => {
  return (
    <div className="p-4">
      <div className="max-w-sm rounded overflow-hidden">
        <img
          className="w-card-classroom-img h-card-classroom-img  object-cover"
          src={cover}
          alt="Sunset in the mountains"
        />
        <div className="py-4">{children}</div>
      </div>
    </div>
  );
};

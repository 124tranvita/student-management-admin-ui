import React from "react";

type Props = {
  path: string;
  width?: string;
  height?: string;
};

export const AvatarImg: React.FC<Props> = ({
  path,
  width = "32",
  height = "32",
}) => {
  return (
    <div className="p-1 mx-4">
      <img
        className="object-cover"
        src={path}
        alt={path}
        width={width}
        height={height}
      />
    </div>
  );
};

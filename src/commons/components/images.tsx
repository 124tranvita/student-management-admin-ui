import React from "react";

type Props = {
  path: string;
  width?: string;
  height?: string;
};

export const AvatarImg: React.FC<Props> = ({
  path,
  width = "46",
  height = "46",
}) => {
  return (
    <>
      <img
        className="object-cover"
        src={path}
        alt={path}
        width={width}
        height={height}
      />
    </>
  );
};

import React from "react";
import { classNames } from "../utils";
import { Icons } from ".";

type Props = {
  children?: React.ReactNode;
  value?: string;
  onClick?: () => void;
};

/** General container */
export const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="container md:w-4/6 mx-auto items-center">
      <div className="w-full flex justify-around flex-wrap">{children}</div>
    </div>
  );
};

/** General container */
export const FlexContainer: React.FC<Props> = ({ children }) => {
  return <div className="w-full flex flex-wrap justify-start">{children}</div>;
};

/** Wrapper container */
export const Wrapper: React.FC<Props> = ({ children, onClick }) => {
  return (
    <div className="relative w-full p-6 h-screen">
      <div className="fixed bottom-2 left-2">
        <button
          className="inline-flex justify-center rounded-md border border-transparent px-1 py-1 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 bg-red-100 text-red-900 hover:bg-red-200"
          onClick={onClick}
        >
          <Icons.LogOutIcon width="32" height="32" />
        </button>
      </div>
      <div className="flex justify-start h-full p-4">{children}</div>
    </div>
  );
};

/** Fixed container */
enum Variant {
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",
}

type FixedContainerProps = {
  children: React.ReactNode;
  variant?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

const VariantMap = {
  [Variant.TOP_LEFT]: "top-12 left-20",
  [Variant.TOP_RIGHT]: "top-12 right-20",
  [Variant.BOTTOM_LEFT]: "bottom-12 left-20",
  [Variant.BOTTOM_RIGHT]: "bottom-16 right-20",
};

const AbsVariantMap = {
  [Variant.TOP_LEFT]: "-top-12 left-4",
  [Variant.TOP_RIGHT]: "-top-12 right-4",
  [Variant.BOTTOM_LEFT]: "bottom-12 left-4",
  [Variant.BOTTOM_RIGHT]: "bottom-16 right-4",
};

export const FixedContainer: React.FC<FixedContainerProps> = ({
  children,
  variant = "top-left",
}) => {
  return (
    <div className={classNames("fixed", VariantMap[variant])}>{children}</div>
  );
};

export const AbsContainer: React.FC<FixedContainerProps> = ({
  children,
  variant = "top-left",
}) => {
  return (
    <div
      className={classNames(
        "absolute flex justify-between",
        AbsVariantMap[variant]
      )}
    >
      {children}
    </div>
  );
};

/** Hash tag div */
export const HashDiv: React.FC<Props> = ({ value }) => {
  return (
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 m-1">
      #{value}
    </span>
  );
};

/** Full Container */
export const FullContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen w-full bg-signin-pattern flex place-items-center justify-center items-center">
      {children}
    </div>
  );
};

// /** List Wrapper */
// export const ListWrapper: React.FC<Props> = ({ children }) => {
//   return (
//     <div className="overflow-y-auto">
//       <ul className="h-full">{children}</ul>
//     </div>
//   );
// };

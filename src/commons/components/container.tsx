import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { analystPath, classNames } from "../utils";
import { ComponentLoader, Dropdown, Icons } from ".";

type DestObj = {
  name: string;
  to: string;
  destiny: boolean;
};

type Props = {
  children?: React.ReactNode;
  value?: string;
  onClick?: () => void;
  path?: string;
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
export const Wrapper: React.FC<Props> = ({ children, onClick, path }) => {
  const destObj = useMemo(() => {
    return analystPath(path);
  }, [path]);

  return (
    <div className="relative w-full p-6">
      <div className="absolute top-2 right-2 z-50">
        <button
          className="inline-flex justify-center rounded-md border border-transparent px-1 py-1 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 bg-red-100 text-red-900 hover:bg-red-200"
          onClick={onClick}
        >
          <Icons.LogOutIcon />
        </button>
      </div>
      <div className="fixed lg:top-1 2xl:top-10 lg:left-1 2xl:left-10 lg:bottom-1 2xl:bottom-10 lg:right-1 2xl:right-10 px-12 py-8 bg-white border border-slate-100 rounded-md shadow-lg hover:shadow-xl duration-300 overflow-y-auto">
        <div className="flex pl-4">
          <Dropdown />
          <div className="items-center ml-1 border-b-2 border-white">
            {destObj &&
              destObj.length > 0 &&
              destObj.map((item: DestObj, index: number) => (
                <Link key={index} to={item.to}>
                  <span
                    className={`text-base ${
                      item.destiny
                        ? "text-slate-400 no-underline"
                        : "text-sky-500 underline"
                    }`}
                  >
                    {` / ${item.name}`}
                  </span>
                </Link>
              ))}
          </div>
        </div>
        <div className="flex justify-start">{children}</div>
      </div>
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

/** List Wrapper */
export const ListWrapper: React.FC<Props> = ({ children }) => {
  return <div className="overflow-y-auto">{children}</div>;
};

/** No List Data */
export const ListEmpty: React.FC = () => {
  return (
    <div className="flex justify-center items-center place-items-center h-70vh relative p-4">
      <div>No data</div>
    </div>
  );
};

/** Container for right panel */
type RightContainerProps = {
  upperBtn: React.ReactNode;
  list: React.ReactNode;
  pagination: React.ReactNode;
};
export const RightContainer: React.FC<RightContainerProps> = ({
  upperBtn,
  list,
  pagination,
}) => {
  return (
    <div className="relative w-full flex flex-col -mt-12 justify-between">
      {/* upper button */}
      <div className="flex justify-end" style={{ marginBottom: "0.5rem" }}>
        {upperBtn}
      </div>
      {/* list wrapper */}
      <div style={{ flex: "2" }}>{list}</div>
      {/* pagination */}
      <div style={{ flex: "1" }}>{pagination}</div>
    </div>
  );
};

// Multi children for component: https://daveceddia.com/pluggable-slots-in-react-components/

type LeftContainerProps = {
  detail: React.ReactNode;
};
export const LeftContainer: React.FC<LeftContainerProps> = ({ detail }) => {
  return (
    <div className="relative w-1/4 flex flex-col justify-between">
      {/* list wrapper */}
      <div style={{ flex: "2" }}>{detail}</div>
    </div>
  );
};

type InfoContainerProps = {
  cover: React.ReactNode;
  info: React.ReactNode;
  assginedUpper?: React.ReactNode;
  assginedLower?: React.ReactNode;
  bottom?: React.ReactNode;
};

export const InfoContainer: React.FC<InfoContainerProps> = ({
  cover,
  info,
  assginedUpper,
  assginedLower,
  bottom,
}) => {
  return (
    <div className="p-4">
      <div className="relative max-w-sm rounded overflow-hidden">
        {cover}
        <div className="pt-12">
          <div className="mb-3">{info}</div>
          <hr className="my-1 w-90per mx-auto" />
          {assginedUpper || assginedLower ? (
            <div className="mb-3">
              {assginedUpper && (
                <div className="flex flex-col items-center">
                  {assginedUpper}
                </div>
              )}
              {assginedLower && (
                <div className="flex flex-col items-center">
                  {assginedLower}
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
          {bottom ? (
            <>
              <hr className="my-1 w-90per mx-auto" />
              <div>{bottom}</div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

type CoverContainerProps = {
  cover?: string;
  avatar?: string;
};

export const CoverContainer: React.FC<CoverContainerProps> = ({
  cover,
  avatar,
}) => {
  const defaultCover =
    "https://img.freepik.com/premium-vector/modern-digital-futuristic-abstract-background-template_358261-24.jpg";

  return (
    <>
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
    </>
  );
};
type AssignContainerProps = {
  searchInput: React.ReactNode;
  list: React.ReactNode;
  pagination: React.ReactNode;
  button: React.ReactNode;
  isLoading: boolean;
};

export const AssignContainer: React.FC<AssignContainerProps> = ({
  searchInput,
  list,
  pagination,
  button,
  isLoading,
}) => {
  return (
    <>
      <div className="flex w-full justify-between mb-2">
        <span style={{ flex: "1" }} className="mr-2 ">
          {searchInput}
        </span>
        <span className="text-end">{button}</span>
      </div>

      {isLoading ? (
        <>
          <ComponentLoader />
        </>
      ) : (
        <div className="flex flex-col justify-center">
          <ul className="overflow-auto h-48vh 2xl:h-58vh">{list}</ul>
          <div>{pagination}</div>
        </div>
      )}
    </>
  );
};

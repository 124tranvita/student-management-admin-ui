import React, { ButtonHTMLAttributes, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { classNames } from "../utils";
import { BackIcon } from "./icons";

enum Variant {
  Primary = "primary",
  Success = "success",
  Danger = "danger",
}

const VariantMap = {
  [Variant.Primary]: "bg-blue-100 text-blue-900 hover:bg-blue-200",
  [Variant.Success]: "bg-green-100 text-green-900 hover:bg-green-200",
  [Variant.Danger]: "bg-red-100 text-red-900 hover:bg-red-200",
};

type ButtonProps = {
  label?: string;
  variant: "primary" | "success" | "danger";
  onClick?: () => void;
  children?: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  label,
  type = "button",
  variant,
  onClick,
}) => {
  return (
    <div className="mt-4">
      <button
        type={type}
        className={classNames(
          "inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          VariantMap[variant]
        )}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

Button.defaultProps = {
  variant: Variant.Primary,
};

export const RoundedButton: React.FC<ButtonProps> = ({
  label,
  type = "button",
  variant,
  onClick,
}) => {
  return (
    <div className="mt-4">
      <button
        type={type}
        className={classNames(
          "w-16 h-16 inline-flex justify-center items-center rounded-full border border-transparent text-3xl font-extrabold shadow-md focus:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          VariantMap[variant]
        )}
        onClick={onClick}
      >
        <span className="mb-1">{label}</span>
      </button>
    </div>
  );
};

RoundedButton.defaultProps = {
  variant: Variant.Primary,
};

export const IconButton: React.FC<ButtonProps> = ({
  children,
  type = "button",
  variant,
  onClick,
}) => {
  return (
    <button
      type={type}
      className={classNames(
        "inline-flex justify-center items-center rounded-full border border-transparent text-3xl font-extrabold focus:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        VariantMap[variant]
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const BackButton: React.FC<{ path?: string }> = ({ path }) => {
  const navigate = useNavigate();

  const hanldeNavigate = useCallback(() => {
    if (path) {
      return navigate(path);
    }
    return navigate(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <button
      className="rounded-md hover:shadow-sm hover:border-slate-100 hover:bg-slate-100"
      onClick={hanldeNavigate}
    >
      <BackIcon width="36" height="36" />
    </button>
  );
};

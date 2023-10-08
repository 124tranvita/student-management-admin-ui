import React, {
  ButtonHTMLAttributes,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { classNames } from "../utils";
import { BackIcon, ReloadIcon } from "./icons";

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

const Disabled = "bg-slate-200 text-slate-400 hover:bg-slate-200";

type ButtonProps = {
  label?: string | React.ReactNode;
  variant: "primary" | "success" | "danger";
  onClick?: () => void;
  children?: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  label,
  type = "button",
  variant,
  disabled = false,
  onClick,
}) => {
  return (
    <div className="mt-4">
      <button
        type={type}
        className={classNames(
          "inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          VariantMap[variant],
          `${disabled ? "bg-slate-200 hover:bg-slate-200 text-slate-400" : ""}`
        )}
        onClick={onClick}
        disabled={disabled}
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
          "inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
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

export const RoundedIconButton: React.FC<ButtonProps> = ({
  children,
  type = "button",
  variant,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={classNames(
        "inline-flex justify-center items-center rounded-full border border-transparent text-3xl font-extrabold focus:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        disabled ? Disabled : VariantMap[variant]
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
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
        "items-center rounded-lg border border-transparent text-3xl font-extrabold focus:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        VariantMap[variant]
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const ButtonLoader: React.FC<ButtonProps> = ({
  type = "button",
  variant,
}) => {
  return (
    <button
      type={type}
      className={classNames(
        "inline-flex justify-center items-center rounded-lg border border-transparent text-3xl font-extrabold focus:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        VariantMap[variant]
      )}
    >
      <div role="status" className="px-3 py-1">
        <svg
          className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
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

export const ReloadButton: React.FC = () => {
  const handleRefreshPage = () => {
    window.location.reload();
  };
  return (
    <>
      <Button
        variant="primary"
        label={<ReloadIcon />}
        onClick={handleRefreshPage}
      />
    </>
  );
};

type SwitchButtonProps = {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
};

export const SwitchButton: React.FC<SwitchButtonProps> = ({
  filter,
  setFilter,
}) => {
  const handleSwitch = () => {
    if (filter === "0") {
      setFilter("1");
    } else {
      setFilter("0");
    }
  };
  return (
    <>
      <Button
        variant="primary"
        label={filter === "0" ? "Mentor" : "Admin"}
        onClick={handleSwitch}
      />
    </>
  );
};

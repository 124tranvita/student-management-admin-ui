import React from "react";
import { Error } from "../model";
import { Button } from "./buttons";

type Props = {
  children: React.ReactNode;
  error: Error | null;
  isLoading: boolean;
  handleSubmit: () => void;
};

const AuthContainer: React.FC<Props> = ({
  children,
  error,
  isLoading,
  handleSubmit,
}) => {
  return (
    <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
      <div className="py-4 mb-3">
        <div className="text-3xl text-center font-semibold ">
          <span>Admin Panel</span>
        </div>
        <div className="text-sm text-center text-slate-400 mb-3 ">
          <span>v1.0.0.1</span>
        </div>
        {error && (
          <div className="text-sm font-semibold text-center text-red-400">
            <span>{error?.message}</span>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center space-x-2 animate-bounce ">
            <div className="w-3 h-3 rounded-sm bg-blue-400 animate-spin"></div>
            <div className="w-3 h-3 rounded-sm bg-green-400 animate-spin"></div>
            <div className="w-3 h-3 rounded-sm bg-black animate-spin"></div>
          </div>
        )}
      </div>
      {children}
      <div className="mx-3 text-center">
        <Button label="Singin" onClick={handleSubmit} variant="primary" />
      </div>
    </div>
  );
};

export default AuthContainer;

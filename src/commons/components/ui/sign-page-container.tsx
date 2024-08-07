import React from "react";

type Props = {
  error: string | null;
  isLoading: boolean;
  children: React.ReactNode;
};

const SignPageContainer: React.FC<Props> = ({ error, isLoading, children }) => {
  return (
    <div className="h-screen w-full bg-signin-pattern flex place-items-center justify-center items-center">
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
              <span>{error}</span>
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
      </div>
    </div>
  );
};

export default SignPageContainer;

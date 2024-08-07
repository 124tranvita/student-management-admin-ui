import React from "react";

export const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 min-h-[100vh] flex items-center justify-center z-50 bg-slate-50">
      <div className="flex items-center justify-center space-x-2 animate-bounce ">
        <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
        <div className="w-8 h-8 bg-green-400 rounded-full"></div>
        <div className="w-8 h-8 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export const ComponentLoader: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex items-center justify-center space-x-2 animate-bounce ">
        <div className="w-4 h-4 rounded-sm bg-blue-400 animate-spin"></div>
        <div className="w-4 h-4 rounded-sm bg-green-400 animate-spin"></div>
        <div className="w-4 h-4 rounded-sm bg-black animate-spin"></div>
      </div>
    </div>
  );
};

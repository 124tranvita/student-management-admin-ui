import React, { Fragment, ReactNode } from "react";
import { Transition, TransitionChild } from "@headlessui/react";

import { capitalize } from "../utils";
import { ComponentLoader, Buttons } from "../components";

type Props = {
  isOpen: boolean;
  children: ReactNode;
};

export const Wrapper: React.FC<Props> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <React.Fragment>
      <Transition appear show={isOpen} as={Fragment}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`fixed inset-0 bg-black bg-opacity-50 z-40`}></div>
        </TransitionChild>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            className={`fixed inset-0 flex items-center justify-center z-50`}
          >
            <div className="relative bg-white p-6 rounded-lg dur shadow-lg w-2/3 max-w-lg">
              {children}
            </div>
          </div>
        </TransitionChild>
      </Transition>
    </React.Fragment>
  );
};

type FormProps = {
  type: "add" | "update" | "assign" | "delete" | "unassign";
  title: string;
  isLoading: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Form: React.FC<FormProps> = ({
  type = "add",
  title,
  isLoading,
  onClose,
  children,
}) => {
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 rounded-lg z-50">
          <ComponentLoader />
        </div>
      )}
      {/* header */}
      <h2 className="text-lg font-medium leading-6 text-gray-900">{title}</h2>
      <hr className="my-3" />
      {/* body */}
      <div className="mb-4 max-h-[75vh] overflow-y-auto">
        <div>{children}</div>
      </div>
      {/* footer */}
      <div className="flex justify-around mt-4">
        <Buttons.Button
          type="submit"
          label={capitalize(type)}
          variant="primary"
          disabled={isLoading}
        />
        <Buttons.Button
          type="button"
          label="Close"
          variant="danger"
          disabled={isLoading}
          onClick={onClose}
        />
      </div>
    </>
  );
};

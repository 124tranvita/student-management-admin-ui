import React, { Fragment, ReactNode } from "react";
import { Transition, TransitionChild } from "@headlessui/react";
import { Button } from "./buttons";
import { capitalize } from "../utils";
import { ComponentLoader } from "./loader";

type Props = {
  type: "add" | "update" | "assign" | "delete" | "unassign";
  title: string;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal: React.FC<Props> = ({
  type = "add",
  title,
  isLoading,
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  console.log("RENDER MODAL");

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
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-40`}
            onClick={onClose}
          ></div>
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
              {isLoading && (
                <div className="absolute inset-0 rounded-lg z-50">
                  <ComponentLoader />
                </div>
              )}
              {/* header */}
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                {title}
              </h2>
              <hr className="my-3" />
              {/* body */}
              <div className="mb-4 h-[75vh] overflow-y-auto">
                <div>{children}</div>
              </div>
              {/* footer */}
              <div className="flex justify-around mt-4">
                <Button
                  type="submit"
                  label={capitalize(type)}
                  variant="primary"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  label="Close"
                  variant="danger"
                  disabled={isLoading}
                  onClick={onClose}
                />
              </div>
            </div>
          </div>
        </TransitionChild>
      </Transition>
    </React.Fragment>
  );
};

export default Modal;

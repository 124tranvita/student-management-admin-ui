import React, { Fragment, useState } from "react";
import { useFormikContext } from "formik";
import { Dialog, Transition } from "@headlessui/react";
import { Button, IconButton } from "./buttons";
import { DeleteIcon, DetailIcon } from "./icons";
import { EventId } from "../constants";

type DialogModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  button: React.ReactNode;
  closeModal: () => void;
};

export const DialogModal: React.FC<DialogModalProps> = ({
  children,
  button,
  isOpen,
  closeModal,
}) => {
  return (
    <React.Fragment>
      <div className="flex items-center justify-center">{button}</div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {children}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </React.Fragment>
  );
};

type FormModalProps = {
  title: string;
  children: React.ReactNode;
  handleSubmit?: () => void;
  type?: "add" | "update" | "assign" | "delete" | "unassign";
};

type FormModalWithEventProps = {
  setEventId: (value: EventId) => void;
};

/** Add form dialog modal */
export const AddFormModal: React.FC<
  FormModalProps & FormModalWithEventProps
> = ({ children, title, handleSubmit, setEventId }) => {
  const formikBag = useFormikContext();
  const [isOpen, setIsOpen] = useState(false);

  const RenderedButton = (
    <>
      <Button type="button" label="Add" onClick={openModal} variant="primary" />
    </>
  );

  function closeModal() {
    setIsOpen(false);
    setEventId(EventId.Init);
    formikBag.setErrors({});
    formikBag.resetForm();
  }

  function openModal() {
    setEventId(EventId.Add);
    setIsOpen(true);
  }

  return (
    <DialogModal
      isOpen={isOpen}
      button={RenderedButton}
      closeModal={closeModal}
    >
      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          {title}
        </Dialog.Title>
        <div className="mt-2">{children}</div>

        <div className="flex justify-around mt-4">
          <Button
            type="submit"
            label="Add"
            variant="primary"
            onClick={handleSubmit}
          />
          <Button
            type="button"
            label="Close"
            variant="danger"
            onClick={closeModal}
          />
        </div>
      </Dialog.Panel>
    </DialogModal>
  );
};

/** Update form dialog modal */
export const UpdateFormModal: React.FC<
  FormModalProps & FormModalWithEventProps
> = ({ children, title, handleSubmit, setEventId }) => {
  const formikBag = useFormikContext();
  const [isOpen, setIsOpen] = useState(false);

  const RenderedButton = (
    <>
      <IconButton
        onClick={openModal}
        label="Update"
        variant="primary"
        type="button"
      >
        <DetailIcon />
      </IconButton>
    </>
  );

  function closeModal() {
    setIsOpen(false);
    setEventId(EventId.Init);
    formikBag.setErrors({});
  }

  function openModal() {
    setEventId(EventId.Update);
    setIsOpen(true);
  }

  return (
    <DialogModal
      isOpen={isOpen}
      button={RenderedButton}
      closeModal={closeModal}
    >
      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          {title}
        </Dialog.Title>
        <div className="mt-2">{children}</div>

        <div className="flex justify-around mt-4">
          <Button
            type="submit"
            label="Update"
            variant="primary"
            onClick={handleSubmit}
          />
          <Button
            type="button"
            label="Close"
            variant="danger"
            onClick={closeModal}
          />
        </div>
      </Dialog.Panel>
    </DialogModal>
  );
};

/** Assign form dialog modal */
export const AsignFormModal: React.FC<FormModalProps> = ({
  children,
  title,
  handleSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const RenderedButton = (
    <>
      <Button onClick={openModal} label="Assign" variant="primary" />
    </>
  );

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <DialogModal
      isOpen={isOpen}
      button={RenderedButton}
      closeModal={closeModal}
    >
      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          {title}
        </Dialog.Title>
        <div className="mt-2">{children}</div>

        <div className="flex justify-around mt-4">
          <Button
            type="submit"
            label="Assign"
            variant="primary"
            onClick={handleSubmit}
          />
          <Button
            type="button"
            label="Close"
            variant="danger"
            onClick={closeModal}
          />
        </div>
      </Dialog.Panel>
    </DialogModal>
  );
};

/** Unasign form dialog modal */
export const UnasignFormModal: React.FC<FormModalProps> = ({
  children,
  title,
  handleSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const RenderedButton = (
    <>
      <IconButton variant="danger" onClick={openModal}>
        <DeleteIcon />
      </IconButton>
    </>
  );

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <DialogModal
      isOpen={isOpen}
      button={RenderedButton}
      closeModal={closeModal}
    >
      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          {title}
        </Dialog.Title>
        <div className="mt-2">{children}</div>

        <div className="flex justify-around mt-4">
          <Button
            type="submit"
            label="Unassign"
            variant="danger"
            onClick={handleSubmit}
          />
          <Button
            type="button"
            label="Close"
            variant="primary"
            onClick={closeModal}
          />
        </div>
      </Dialog.Panel>
    </DialogModal>
  );
};

/** Delete form dialog modal */
export const DeleteFormModal: React.FC<
  FormModalProps & FormModalWithEventProps
> = ({ children, title, handleSubmit, setEventId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const RenderedButton = (
    <>
      <IconButton variant="danger" onClick={openModal}>
        <DeleteIcon />
      </IconButton>
    </>
  );

  function closeModal() {
    setEventId(EventId.Init);
    setIsOpen(false);
  }

  function openModal() {
    setEventId(EventId.Delete);
    setIsOpen(true);
  }

  return (
    <DialogModal
      isOpen={isOpen}
      button={RenderedButton}
      closeModal={closeModal}
    >
      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          {title}
        </Dialog.Title>
        <div className="mt-2">{children}</div>

        <div className="flex justify-around mt-4">
          <Button
            type="submit"
            label="Delete"
            variant="danger"
            onClick={handleSubmit}
          />
          <Button
            type="button"
            label="Close"
            variant="primary"
            onClick={closeModal}
          />
        </div>
      </Dialog.Panel>
    </DialogModal>
  );
};

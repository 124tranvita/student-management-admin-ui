import React, { Fragment, useState } from "react";
import { useFormikContext } from "formik";
import { Dialog, Transition } from "@headlessui/react";
import { Button, IconButton, RoundedIconButton } from "./buttons";
import { DeleteIcon, EditIcon, AssignIcon, UnassignIcon } from "./icons";
import { EventId } from "../constants";
import { isNotNullData } from "../utils";

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
  handleSubmit: () => void;
  type?: "add" | "update" | "assign" | "delete" | "unassign";
  disabled?: boolean;
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

  const closeModal = () => {
    setIsOpen(false);
    setEventId(EventId.None);
    formikBag.setErrors({});
    formikBag.resetForm();
  };

  const openModal = () => {
    setEventId(EventId.Add);
    setIsOpen(true);
  };

  const onClickEvent = () => {
    handleSubmit();

    if (!isNotNullData(formikBag.errors)) {
      setIsOpen(false);
    }
  };

  const RenderedButton = (
    <>
      <Button type="button" label="Add" onClick={openModal} variant="primary" />
    </>
  );

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
            onClick={onClickEvent}
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
> = ({ children, title, handleSubmit, setEventId, disabled }) => {
  const formikBag = useFormikContext();
  const [isOpen, setIsOpen] = useState(false);

  const RenderedButton = (
    <>
      <RoundedIconButton
        onClick={openModal}
        label="Update"
        variant="primary"
        type="button"
        disabled={disabled}
      >
        <EditIcon />
      </RoundedIconButton>
    </>
  );

  function closeModal() {
    setIsOpen(false);
    setEventId(EventId.None);
    formikBag.setTouched({}, false);
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

/** Delete form dialog modal */
export const DeleteFormModal: React.FC<
  FormModalProps & FormModalWithEventProps
> = ({ children, title, handleSubmit, setEventId, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const RenderedButton = (
    <>
      <RoundedIconButton
        variant="danger"
        onClick={openModal}
        disabled={disabled}
      >
        <DeleteIcon />
      </RoundedIconButton>
    </>
  );

  function closeModal() {
    setEventId(EventId.None);
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

/** Assign form dialog modal */
export const AssignFormModal: React.FC<
  FormModalProps & FormModalWithEventProps
> = ({ children, title, handleSubmit, setEventId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const RenderedButton = (
    <>
      <RoundedIconButton variant="primary" onClick={openModal}>
        <AssignIcon />
      </RoundedIconButton>
    </>
  );

  function closeModal() {
    setEventId(EventId.None);
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

/** Unassign form dialog modal */
export const UnassignFormModal: React.FC<
  FormModalProps & FormModalWithEventProps
> = ({ children, title, handleSubmit, setEventId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const RenderedButton = (
    <>
      <RoundedIconButton variant="danger" onClick={openModal}>
        <UnassignIcon />
      </RoundedIconButton>
    </>
  );

  function closeModal() {
    setEventId(EventId.None);
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
            label="Unassign"
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

/** General Modal */
type AssignModalProps = {
  icon: React.ReactNode;
  label: string;
  isAssign: boolean;
  setIsAssign: (value: boolean) => void;
};
export const AssignModal: React.FC<FormModalProps & AssignModalProps> = ({
  children,
  icon,
  title,
  label,
  isAssign,
  setIsAssign,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const RenderedButton = (
    <>
      <IconButton
        onClick={openModal}
        variant="primary"
        type="button"
        label={label}
      >
        {icon}
      </IconButton>
    </>
  );

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsAssign(true);
    setIsOpen(true);
  }

  return (
    <DialogModal
      isOpen={isOpen}
      button={RenderedButton}
      closeModal={closeModal}
    >
      <Dialog.Panel className="w-60vw h-80vh transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900 mb-8"
        >
          {title}
        </Dialog.Title>
        <div className="mt-2 h-62vh">{children}</div>

        <div className="flex justify-around mt-4">
          <Button
            type="button"
            label="Switch"
            variant="primary"
            onClick={() => setIsAssign(!isAssign)}
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

type NoAssignProps = {
  content: string;
};

export const NoAssign: React.FC<NoAssignProps> = ({ content }) => {
  return (
    <div className="flex justify-center items-center place-items-center w-full bg-gray-100 rounded-md relative p-4">
      <div>{content}</div>
    </div>
  );
};

/** Confirm dialog modal */
type ConfirmModalProps = {
  label: string;
  disabled: boolean;
};
export const ConfirmModal: React.FC<
  FormModalProps & FormModalWithEventProps & ConfirmModalProps
> = ({ children, title, label, disabled, handleSubmit, setEventId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const RenderedButton = (
    <>
      <Button
        type="button"
        label={label}
        onClick={openModal}
        variant="primary"
        disabled={disabled}
      />
    </>
  );

  function closeModal() {
    setEventId(EventId.None);
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
            label="Confirm"
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

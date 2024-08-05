// src/components/mentor/create/container.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Constants from "../../../commons/constants";
import { Mentor, mentorInitial } from "../../../commons/model";
import { isNotNullData, isResponseSuccessfully } from "../../../commons/utils";
import { Buttons } from "../../../commons/components";
import { CreateFormType } from "./type";
import { validationSchema } from "./validatation-schema";
import CreateForm from "./create-form";
import useCallMentorApi from "../hooks/useCallMentorApi";
import { Modal } from "../../../commons/compound-components";

type Props = {
  setEventId: (value: string) => void;
  setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
};

const CreateContainer: React.FC<Props> = ({ setEventId, setMentors }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormType>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  /** Custom hooks */
  const { callApiOnCreate, response, isLoading, error } =
    useCallMentorApi<Mentor>(mentorInitial);

  /** Check API response */
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      setMentors((prevState: Mentor[]) => [...prevState, response.data]);
    } else {
      if (error) {
        console.error({ error });
      }
    }

    // Reset form them close modal on success
    reset();
    setIsOpen(false);
    setEventId(Constants.EventId.None);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

  /** Handle submit */
  const onSubmit = useCallback(
    (values: CreateFormType) => {
      const data = {
        email: values.email,
        name: values.name,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
        languages: values.languages.replace(/' '/g, "").split(","),
        education: values.education,
        specialized: values.specialized,
        status: Constants.Status.Active,
        avatar: values.avatar,
        roles: values.roles,
      };

      callApiOnCreate<Omit<CreateFormType, "languages">>(data);
    },

    [callApiOnCreate]
  );

  /** Handle open modal */
  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  /** Handle close modal */
  const handleCloseModal = useCallback(() => {
    reset();
    setIsOpen(false);
    setEventId(Constants.EventId.Init);
  }, [setEventId, reset]);

  return (
    <>
      <Buttons.Button
        type="button"
        label="Add"
        onClick={handleOpenModal}
        variant="primary"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Wrapper isOpen={isOpen}>
          <Modal.Form
            type="add"
            title="Add new mentor"
            isLoading={isLoading}
            onClose={handleCloseModal}
          >
            <CreateForm register={register} errors={errors} />
          </Modal.Form>
        </Modal.Wrapper>
      </form>
    </>
  );
};

export default CreateContainer;

// src/components/mentor/create/container.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthContext } from "../../../hooks/useAuthContext";
import useCallApi from "../../../hooks/useCallApi";
import * as Constants from "../../../commons/constants";
import {
  Response,
  Mentor,
  responseInitial,
  mentorInitial,
} from "../../../commons/model";
import { isNotNullData, isResponseSuccessfully } from "../../../commons/utils";
import { Buttons } from "../../../commons/components";
import Modal from "../../../commons/components/modal";
import { CreateFormType } from "./type";
import { validationSchema } from "./validatation-schema";
import CreateForm from "./create-form";

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
  const { userInfo } = useAuthContext();
  const { callApi, response, isLoading, error } = useCallApi<Response<Mentor>>({
    ...responseInitial,
    data: mentorInitial,
  });

  /** Check API response */
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      setMentors((prevState: Mentor[]) => [...prevState, response.data]);
    } else {
      console.error({ error });
    }

    // Reset form them close modal on success
    reset();
    setIsOpen(false);
    setEventId(Constants.EventId.None);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  /** Create Submit */
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

      callApi("mentor", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo.tokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callApi, userInfo.tokens.accessToken]
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
        <Modal
          type="add"
          title="Add new mentor"
          isLoading={isLoading}
          isOpen={isOpen}
          onClose={handleCloseModal}
        >
          <CreateForm register={register} errors={errors} />
        </Modal>
      </form>
    </>
  );
};

export default CreateContainer;

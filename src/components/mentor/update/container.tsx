// src/components/mentor/update/container.tsx
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
import { EditIcon } from "../../../commons/components/icons";
import Modal from "../../../commons/components/modal";
import { UpdateFormType } from "./type";
import { validationSchema } from "./validatation-schema";
import UpdateForm from "./update-form";
import { validateSubmission } from "./validate-submission";

type Props = {
  mentor: Mentor;
  setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
  setEventId: (value: string) => void;
};

const UpdateContainer: React.FC<Props> = ({
  mentor,
  setMentors,
  setEventId,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<UpdateFormType>({
    defaultValues: {
      email: mentor.email,
      name: mentor.name,
      languages: mentor.languages.toString(),
      education: mentor.education,
      specialized: mentor.specialized,
      avatar: mentor.avatar,
      roles: mentor.roles,
    },
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
      setMentors((prevState: Mentor[]) => {
        const index = prevState.findIndex(
          (item: Mentor) => item._id === response.data._id
        );

        prevState[index] = response.data;
        return [...prevState];
      });

      // Reset form them close modal on success
      reset();
      setIsOpen(false);
      setEventId(Constants.EventId.None);
    } else {
      console.error({ error });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  /** Create Submit */
  const onSubmit = useCallback(
    (values: UpdateFormType) => {
      const errors = validateSubmission(values, mentor);

      if (errors && errors.length > 0) {
        errors.forEach((item) =>
          setError(item.key as keyof UpdateFormType, { message: item.message })
        );
        return;
      }

      const data = {
        email: values.email,
        name: values.name,
        languages: values.languages.replace(/' '/g, "").split(","),
        education: values.education,
        specialized: values.specialized,
        status: values.status,
        avatar: values.avatar,
        roles: values.roles,
      };

      callApi(`mentor/${mentor._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${userInfo.tokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    [callApi, setError, mentor, userInfo.tokens.accessToken]
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
      <Buttons.RoundedIconButton
        type="button"
        label="Update"
        onClick={handleOpenModal}
        variant="primary"
      >
        <EditIcon />
      </Buttons.RoundedIconButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal
          type="update"
          title={`Update mentor ${mentor.name}`}
          isLoading={isLoading}
          isOpen={isOpen}
          onClose={handleCloseModal}
        >
          <UpdateForm register={register} errors={errors} />
        </Modal>
      </form>
    </>
  );
};

export default UpdateContainer;

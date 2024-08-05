// src/components/mentor/update/container.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Constants from "../../../commons/constants";
import { Mentor, mentorInitial } from "../../../commons/model";
import { isNotNullData, isResponseSuccessfully } from "../../../commons/utils";
import { Buttons } from "../../../commons/components";
import { EditIcon } from "../../../commons/components/icons";
import { UpdateFormType } from "./type";
import { validationSchema } from "./validatation-schema";
import UpdateForm from "./update-form";
import { validateSubmission } from "./validate-submission";
import useCallMentorApi from "../hooks/useCallMentorApi";
import { Modal } from "../../../commons/compound-components";

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
  const { callApiOnUpdate, response, isLoading, error } =
    useCallMentorApi<Mentor>(mentorInitial);

  /** Trigger to reset defaultValues when the value is changed */
  useEffect(() => {
    const values = {
      email: mentor.email,
      name: mentor.name,
      languages: mentor.languages.toString(),
      education: mentor.education,
      specialized: mentor.specialized,
      avatar: mentor.avatar,
      roles: mentor.roles,
    };

    reset(values);
  }, [mentor, reset]);

  /** Check API response */
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      setMentors((prevState: Mentor[]) => {
        const data = [...prevState];
        const index = data.findIndex(
          (item: Mentor) => item._id === response.data._id
        );

        data[index] = response.data;
        return [...data];
      });

      // Reset form them close modal on success
      reset();
      setIsOpen(false);
      setEventId(Constants.EventId.None);
    } else {
      if (error) {
        console.error({ error });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

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

      callApiOnUpdate<Omit<UpdateFormType, "languages">>(mentor._id, data);
    },
    [mentor, callApiOnUpdate, setError]
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
        <Modal.Wrapper isOpen={isOpen}>
          <Modal.Form
            type="update"
            title={`Update mentor ${mentor.name}`}
            isLoading={isLoading}
            onClose={handleCloseModal}
          >
            <UpdateForm register={register} errors={errors} />
          </Modal.Form>
        </Modal.Wrapper>
      </form>
    </>
  );
};

export default UpdateContainer;

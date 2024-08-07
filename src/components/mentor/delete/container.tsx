// src/components/mentor/delete/container.tsx
import React, { useCallback, useEffect, useState } from "react";
import * as Constants from "../../../commons/constants";
import { Mentor, mentorInitial } from "../../../commons/model";
import { isNotNullData, isResponseSuccessfully } from "../../../commons/utils";
import { Buttons, Typography } from "../../../commons/components";

import { DeleteIcon } from "../../../commons/components/icons";
import useCallMentorApi from "../hooks/useCallMentorApi";
import { Modal } from "../../../commons/compound-components";

type Props = {
  mentorId: string;
  setEventId: (value: string) => void;
  setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
};

const DeleteContainer: React.FC<Props> = ({
  mentorId,
  setEventId,
  setMentors,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  /** Custom hooks */
  const { callApiOnDelete, response, isLoading, error } =
    useCallMentorApi<Mentor>(mentorInitial);

  /** Check API response */
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      setMentors((prevState: Mentor[]) => {
        const filtered = prevState.filter(
          (item: Mentor) => item._id !== response.data._id
        );

        return [...filtered];
      });
    } else {
      if (error) {
        console.error({ error });
      }
    }

    // Reset form them close modal on success
    setIsOpen(false);
    setEventId(Constants.EventId.None);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

  /** Handle submit */
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      callApiOnDelete(mentorId);
      e.preventDefault();
    },
    [callApiOnDelete, mentorId]
  );

  /** Handle open modal */
  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  /** Handle close modal */
  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    setEventId(Constants.EventId.Init);
  }, [setEventId]);

  return (
    <>
      <Buttons.RoundedIconButton
        type="button"
        onClick={handleOpenModal}
        variant="danger"
      >
        <DeleteIcon />
      </Buttons.RoundedIconButton>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Modal.Wrapper isOpen={isOpen}>
          <Modal.Form
            type="delete"
            title="Delete selected mentor"
            isLoading={isLoading}
            onClose={handleCloseModal}
          >
            <Typography text="Are you want to delete?" type="base" />
          </Modal.Form>
        </Modal.Wrapper>
      </form>
    </>
  );
};

export default DeleteContainer;

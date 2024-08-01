// src/components/mentor/delete/container.tsx
import React, { useCallback, useEffect, useState } from "react";
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
import { Buttons, Typography } from "../../../commons/components";
import Modal from "../../../commons/components/modal";
import { DeleteIcon } from "../../../commons/components/icons";

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
  const { userInfo } = useAuthContext();
  const { callApi, response, isLoading, error } = useCallApi<Response<Mentor>>({
    ...responseInitial,
    data: mentorInitial,
  });

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
      console.error({ error });
    }

    // Reset form them close modal on success
    setIsOpen(false);
    setEventId(Constants.EventId.None);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  /** Create Submit */
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      callApi(`mentor/${mentorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.tokens.accessToken}`,
        },
      });
      e.preventDefault();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callApi, mentorId, userInfo.tokens.accessToken]
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
        <Modal
          type="delete"
          title="Delete selected mentor"
          isLoading={isLoading}
          isOpen={isOpen}
          onClose={handleCloseModal}
        >
          <Typography text="Are you want to delete?" type="base" />
        </Modal>
      </form>
    </>
  );
};

export default DeleteContainer;

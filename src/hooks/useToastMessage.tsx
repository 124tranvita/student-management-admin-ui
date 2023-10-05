import { FC, useCallback, useState } from "react";
import { getToastMsg } from "../commons/utils";
import { EventId, Status } from "../commons/constants";
import {
  Success,
  ToastMessageWrapper,
  Warning,
  Error,
} from "../commons/components";

export const useToastMessage = () => {
  const [status, setStatus] = useState<Status>(Status.None);
  const [message, setMessage] = useState<string>("");
  const [isDisplayToast, setIsDisplayToast] = useState<boolean>(false);

  const setToastMessage = useCallback((prefix: string, eventId: EventId) => {
    const msg = getToastMsg(prefix, eventId);
    setMessage(msg);
    setStatus(Status.Success);
    setIsDisplayToast(true);
  }, []);

  const setErrorToastMessage = useCallback((msg: string) => {
    setMessage(msg);
    setStatus(Status.Error);
    setIsDisplayToast(true);
  }, []);

  const clearToastMessage = useCallback(() => {
    setStatus(Status.None);
    setMessage("");
    setIsDisplayToast(false);
  }, []);

  const ToastMessage: FC = () => {
    return (
      <>
        <div className="absolute z-50 top-1 left-24 right-24 mx-auto w-1/2">
          <ul>
            {isDisplayToast && (
              <li>
                <ToastMessageWrapper clearToastMessage={clearToastMessage}>
                  {status === Status.Success && <Success msg={message} />}
                  {status === Status.Warning && <Warning msg={message} />}
                  {status === Status.Error && <Error msg={message} />}
                </ToastMessageWrapper>
              </li>
            )}
          </ul>
        </div>
      </>
    );
  };

  return {
    setToastMessage,
    setErrorToastMessage,
    status,
    message,
    ToastMessage,
  };
};

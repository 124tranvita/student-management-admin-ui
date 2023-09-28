import { FC, useEffect, useState } from "react";
import { ErrorStatus } from "../constants";
import {
  ErrorToastMsg,
  SuccessToastMsg,
  WarningToastMsg,
} from "./toast-message-component";

type Props = {
  toastMsgObj: {
    status: string;
    msg: string;
  };
};

export type DisplayProps = {
  success: boolean;
  warning: boolean;
  error: boolean;
};

export const ToastMsgWrapper: FC<Props> = ({ toastMsgObj }) => {
  const [isDisplay, setIsDisplay] = useState<DisplayProps>({
    success: false,
    warning: false,
    error: false,
  });

  const { status, msg } = toastMsgObj;

  useEffect(() => {
    switch (status) {
      case ErrorStatus.Success:
        setIsDisplay({ ...isDisplay, success: true });
        break;
      case ErrorStatus.Warning:
        setIsDisplay({ ...isDisplay, warning: true });
        break;
      case ErrorStatus.Error:
        setIsDisplay({ ...isDisplay, error: true });
        break;
      default:
        setIsDisplay({
          success: false,
          warning: false,
          error: false,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <div className="absolute z-50 top-1 left-24 right-24 mx-auto w-1/2">
      <ul>
        {isDisplay.success && (
          <li>
            <SuccessToastMsg
              isDisplay={isDisplay}
              setIsDisplay={setIsDisplay}
              msg={msg}
            />
          </li>
        )}
        {isDisplay.warning && (
          <li>
            <WarningToastMsg
              isDisplay={isDisplay}
              setIsDisplay={setIsDisplay}
              msg={msg}
            />
          </li>
        )}
        {isDisplay.error && (
          <li>
            <ErrorToastMsg
              isDisplay={isDisplay}
              setIsDisplay={setIsDisplay}
              msg={msg}
            />
          </li>
        )}
      </ul>
    </div>
  );
};

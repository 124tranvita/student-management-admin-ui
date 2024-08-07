import { useContext, useEffect } from "react";
import {
  ContextType,
  EventManagementContext,
} from "../context/EventManagementContext";

export const useEventManagement = <T,>(initEventId?: T) => {
  const context = useContext<ContextType<T>>(EventManagementContext);

  if (!context) {
    throw new Error(
      "useEventManagement must be used inside the EventManagementContext"
    );
  }

  useEffect(() => {
    if (!initEventId) return;

    const { setEventId } = context;
    setEventId(initEventId as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initEventId]);

  return context;
};

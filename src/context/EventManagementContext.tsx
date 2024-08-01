/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, createContext, useCallback, useRef } from "react";

export type ContextType<T> = {
  eventId: T | string;
  setEventId: (value: string) => void;
  getEventId: () => void;
  handlingEventId: (value: string) => boolean;
};

export const EventManagementContext = createContext<ContextType<any>>(
  undefined as any
);

type Props = {
  children: ReactNode;
};

export const EventManagementProvider: FC<Props> = ({ children }) => {
  const prevEventId = useRef<string | null>(null);

  const setEventId = useCallback((eventId: string) => {
    if (prevEventId.current !== eventId) {
      prevEventId.current = eventId;
    }

    return;
  }, []);

  const getEventId = useCallback(() => prevEventId.current, []);

  const handlingEventId = useCallback((eventId: string) => {
    return Boolean(prevEventId.current === eventId);
  }, []);

  return (
    <EventManagementContext.Provider
      value={{
        eventId: prevEventId.current,
        getEventId,
        setEventId,
        handlingEventId,
      }}
    >
      {children}
    </EventManagementContext.Provider>
  );
};

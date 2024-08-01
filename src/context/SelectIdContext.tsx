import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useRef,
  useState,
} from "react";

type ContextType = {
  selectedId: string;
  setSelectedId: (value: string) => void;
};

export const SelectIdContext = createContext<ContextType>({
  selectedId: "",
  setSelectedId: () => null,
});

type Props = {
  children: ReactNode;
};

export const SelectIdProvider: FC<Props> = ({ children }) => {
  const prevId = useRef<string>("");
  const [id, setId] = useState<string>("");

  console.log({ id });

  const setSelectedId = useCallback((id: string) => {
    if (prevId.current === id) return;

    setId(id);
    prevId.current = id;
  }, []);

  return (
    <SelectIdContext.Provider
      value={{
        selectedId: id,
        setSelectedId,
      }}
    >
      {children}
    </SelectIdContext.Provider>
  );
};

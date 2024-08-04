import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useRef,
  useState,
} from "react";

type ContextType = {
  queryString: string;
  setSearchQuery: (value: string) => void;
};

export const SearchQueryContext = createContext<ContextType>({
  queryString: "",
  setSearchQuery: () => null,
});

type Props = {
  children: ReactNode;
};

export const SearchQueryProvider: FC<Props> = ({ children }) => {
  const prevQueryString = useRef<string>("");
  const [queryString, setQueryString] = useState<string>(
    prevQueryString.current
  );

  console.log({ queryString });

  const setSearchQuery = useCallback((query: string) => {
    if (prevQueryString.current === query) return;

    setQueryString(query);
    prevQueryString.current = query;
  }, []);

  return (
    <SearchQueryContext.Provider
      value={{
        queryString,
        setSearchQuery,
      }}
    >
      {children}
    </SearchQueryContext.Provider>
  );
};

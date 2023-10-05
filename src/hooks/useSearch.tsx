import {
  ChangeEvent,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { debounce } from "lodash";
import { EventId, PAGE_LIMIT, PAGE_MAX } from "../commons/constants";

export const useSearch = (
  callApi: (path: string, options: object) => Promise<void>,
  path: string,
  option: object,
  setEventId: (value: SetStateAction<EventId>) => void
) => {
  const [queryString, setQueryString] = useState<string>("");

  // The solution : https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks
  const debouncedSearch = useMemo(
    () =>
      debounce((path: string) => {
        callApi(path, option);
      }, 750),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setQueryString(query);
      debouncedSearch(
        `${path}page=${1}&limit=${
          query ? PAGE_MAX : PAGE_LIMIT
        }&queryString=${query}`
      );

      setEventId(query ? EventId.Search : EventId.None);
    },
    [path, setEventId, debouncedSearch]
  );

  return {
    queryString,
    handleSearch,
  };
};

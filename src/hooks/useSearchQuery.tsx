import { useCallback, useContext, useMemo } from "react";
import { debounce } from "lodash";
import { SearchQueryContext } from "../context/SearchQueryContext";
import { EventId } from "../commons/constants";

export const useSearchQuery = (setEventId: (value: string) => void) => {
  const context = useContext(SearchQueryContext);

  if (!context) {
    throw new Error(
      "useEventManagement must be used inside the EventManagementContext"
    );
  }

  const { queryString, setSearchQuery } = context;

  // The solution : https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
      }, 600),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSearch = useCallback(
    (query: string) => {
      debouncedSearch(query);
      setEventId(EventId.Search);
    },
    [setEventId, debouncedSearch]
  );

  return {
    queryString,
    handleSearch,
    setSearchQuery,
  };
};

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { NavigatePanel, Loader, Buttons } from "../../commons/components";
import { Mentor } from "../../commons/model";
import {
  getMentorFilter,
  isResponseSuccessfully,
  storeHistory,
} from "../../commons/utils";
import {
  BaseContainer,
  ListWithPagination,
  SearchInput,
} from "../../commons/components/ui";
import * as Constants from "../../commons/constants";
import usePagination from "../../hooks/usePagination";
import useSetTitle from "../../hooks/useSetTitle";
import useCallMentorApi from "./hooks/useCallMentorApi";
import { useSearchQuery } from "../../hooks/useSearchQuery";
import { useEventManagement } from "../../hooks/useEventManagement";
import CreateContainer from "./create/container";
import MentorList from "./mentor-list";
import MentorInfo from "./mentor-info";

const MentorContainer: FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filter, setFilter] = useState<string>("0");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(Constants.PAGE_LIMIT);

  /** Custom hooks */
  const {
    callApiOnInit,
    callApiOnValueChange,
    callApiOnPaging,
    response,
    isLoading,
    error,
  } = useCallMentorApi<Mentor[]>([]);
  const { setEventId, handlingEventId } = useEventManagement<Constants.EventId>(
    Constants.EventId.None
  );
  const { setPaginationRange, setGrossCnt } = usePagination(limit);
  const { queryString } = useSearchQuery(setEventId);

  /** Set page title */
  useSetTitle("Mentors management");

  /** Run this request only at init */
  useEffect(() => {
    setEventId(Constants.EventId.Init);
    storeHistory("/mentor");
    callApiOnInit(limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Run this request when search query or filter changed */
  useEffect(() => {
    if (handlingEventId(Constants.EventId.Init)) return;

    callApiOnValueChange(page, limit, filter, queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, queryString]);

  /** Check API response*/
  useEffect(() => {
    if (isResponseSuccessfully(response)) {
      setGrossCnt(response.grossCnt || 0);
      return setMentors(response.data);
    } else {
      if (error) {
        console.error({ error });
      }
    }

    setEventId(Constants.EventId.None);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  /** Set component loading screen*/
  const isComponentLoading = useMemo(() => {
    return (
      isLoading &&
      (handlingEventId(Constants.EventId.Paging) ||
        handlingEventId(Constants.EventId.Search) ||
        handlingEventId(Constants.EventId.Filter))
    );
  }, [isLoading, handlingEventId]);

  /** Handle paging */
  const handlePaging = useCallback(
    (page: number) => {
      setEventId(Constants.EventId.Paging);
      callApiOnPaging(page, limit, filter);
      setPage(page);
    },
    [setEventId, callApiOnPaging, limit, filter]
  );

  if (isLoading && handlingEventId(Constants.EventId.None)) {
    return <Loader />;
  }

  return (
    <>
      <BaseContainer
        renderNavigate={() => (
          <NavigatePanel
            path={[
              {
                name: `Mentors: ${getMentorFilter(filter)}`,
                to: "/mentor",
                destiny: true,
              },
            ]}
          />
        )}
        renderDetailInfo={() => <MentorInfo mentors={mentors} />}
        renderSearchInput={() => <SearchInput setEventId={setEventId} />}
        renderTopControl={() => (
          <>
            <Buttons.SwitchButton
              filter={filter}
              setFilter={setFilter}
              setEventId={setEventId}
            />
            <Buttons.ReloadButton />
            <CreateContainer setEventId={setEventId} setMentors={setMentors} />
          </>
        )}
        renderItemList={() => (
          <ListWithPagination
            currentPage={page}
            isLoading={isComponentLoading}
            paginationRange={setPaginationRange()}
            handlePaging={handlePaging}
            renderItemList={() => (
              <MentorList
                mentors={mentors}
                limit={limit}
                setMentors={setMentors}
                setEventId={setEventId}
              />
            )}
          />
        )}
      />
    </>
  );
};

export default MentorContainer;

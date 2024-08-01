import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { NavigatePanel, Loader, Buttons } from "../../commons/components";
import { Response, Mentor, responseInitial } from "../../commons/model";
import {
  getMentorFilter,
  isNotNullData,
  isResponseSuccessfully,
  storeHistory,
} from "../../commons/utils";
import {
  BaseContainer,
  ListWithPagination,
  NoItemContainer,
} from "../../commons/components/ui";
import * as Constants from "../../commons/constants";
import useCallApi from "../../hooks/useCallApi";
import usePagination from "../../hooks/usePagination";
import useSetTitle from "../../hooks/useSetTitle";
import { useAuthContext } from "../../hooks/useAuthContext";
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
  const { userInfo } = useAuthContext();
  const { setEventId, handlingEventId } = useEventManagement<Constants.EventId>(
    Constants.EventId.None
  );
  const { callApi, response, isLoading, error } = useCallApi<
    Response<Mentor[]>
  >({ ...responseInitial, data: [] });
  const { setPaginationRange, setGrossCnt, setLimit } = usePagination();

  /** Set pagination limit */
  setLimit(limit);

  /** Set page title */
  useSetTitle("Mentors management");

  /** Get mentor list at init */
  useEffect(() => {
    storeHistory("/mentor");
    callApi(
      `mentor?id=${userInfo.info.sub}&role=${filter}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo.tokens.accessToken}`,
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.info.sub, filter]);

  /** Check API response*/
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      setGrossCnt(response.grossCnt || 0);
      return setMentors(response.data);
    }

    setEventId(Constants.EventId.None);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  /** Set component loading screen*/
  const isComponentLoading = useMemo(() => {
    return (
      isLoading &&
      (handlingEventId(Constants.EventId.Paging) ||
        handlingEventId(Constants.EventId.Filter))
    );
  }, [isLoading, handlingEventId]);

  /** Handle paging */
  const handlePaging = useCallback(
    (page: number) => {
      setEventId(Constants.EventId.Paging);
      callApi(
        `mentor?id=${userInfo.info.sub}&role=${filter}&page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.tokens.accessToken}`,
          },
        }
      );
      setPage(page);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userInfo.tokens, filter]
  );

  if (isLoading && handlingEventId(Constants.EventId.None)) {
    return <Loader />;
  }

  if (mentors && mentors.length === 0) {
    return (
      <NoItemContainer
        navigation={() => (
          <NavigatePanel
            path={[{ name: "Mentors", to: "/mentor", destiny: true }]}
          />
        )}
        placeholder={() => (
          <CreateContainer setEventId={setEventId} setMentors={setMentors} />
        )}
      />
    );
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

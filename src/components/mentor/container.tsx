import { FC, useCallback, useEffect, useMemo, useState } from "react";
// import { FormikContext, useFormik } from "formik";
import {
  AbsContainer,
  NavigatePanel,
  Loader,
  ComponentLoader,
  Pagination,
  Buttons,
  ListWrapper,
  ToastMsgWrapper,
} from "../../commons/components";
import {
  Response,
  Mentor,
  responseInitial,
  mentorInitial,
} from "../../commons/model";
import {
  getMentorFilter,
  getResponeMsg,
  isNotNullData,
  isResponseSuccessfully,
  serializedDeleteResponse,
  // serializedPatchResponse,
  storeHistory,
} from "../../commons/utils";
import * as Constants from "../../commons/constants";
import useCallApi from "../../hooks/useCallApi";
import usePagination from "../../hooks/usePagination";
import useSetTitle from "../../hooks/useSetTitle";
import { useAuthContext } from "../../hooks/useAuthContext";
import MentorList from "./mentor-list";
// import { createValidationSchema } from "./validatation-schema";
// import { MentorFormikProps, mentorFormikInitial } from "./types";
import MentorInfo from "./mentor-info";
import AssignPanel from "./assign-panel";
// import { createValidateSubmission } from "./validate-submission";
import NoItem from "./no-item";
import { useEventManagement } from "../../hooks/useEventManagement";
import CreateContainer from "./create/container";
// import { SelectIdProvider } from "../../context/SelectIdContext";
import { BaseContainer } from "../../commons/components/ui";

const MentorContainer: FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentor, setMentor] = useState<Mentor>();
  const [filter, setFilter] = useState<string>("0");
  const [isShowToastMsg, setIsShowToastMsg] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(Constants.PAGE_LIMIT);
  // const [grossCnt, setGrossCnt] = useState<number>(0);
  // const [eventId, setEventId] = useState<Constants.EventId>(
  //   Constants.EventId.Init
  // );

  /** Open form modal */
  // const [isOpen, setIsOpen] = useState<boolean>(false);

  /** Custom hooks */
  const { userInfo } = useAuthContext();
  const { eventId, setEventId } = useEventManagement<Constants.EventId>(
    Constants.EventId.None
  );
  console.log({ eventId });
  const { callApi, response, isLoading, error } = useCallApi<
    Response<Mentor[]> | Response<Mentor>
  >(
    { ...responseInitial, data: [] } || {
      ...responseInitial,
      data: mentorInitial,
    }
  );
  const { setPaginationRange, setGrossCnt, setLimit } = usePagination();
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

  /** Check API response and set mentors data base on event type*/
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      if (eventId === Constants.EventId.Delete) {
        const updated = serializedDeleteResponse(mentors, response.data);
        // setGrossCnt(grossCnt - 1);
        setIsShowToastMsg(true);
        return setMentors(updated as Mentor[]);
      }

      setGrossCnt(response.grossCnt || 0);
      return setMentors(response.data as Mentor[]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  // useEffect(() => {
  //   if (eventId === Constants.EventId.Update) return;
  //   if (mentors && mentors.length > 0) {
  //     setMentor(mentors[0]);
  //   }
  // }, [mentors]);

  /** Get response status */
  const toastMsgObj = useMemo(() => {
    if (error) {
      return {
        status: error.status,
        msg: error.message,
      };
    }

    return {
      status: response.status,
      msg: getResponeMsg("mentor", ""),
    };
  }, [error, response.status, eventId]);

  /** Set component loading screen*/
  // const isComponentLoading = useMemo(() => {
  //   return (
  //     isLoading &&
  //     (eventId === Constants.EventId.Add ||
  //       eventId === Constants.EventId.Update ||
  //       eventId === Constants.EventId.Delete ||
  //       eventId === Constants.EventId.Paging)
  //   );
  // }, [isLoading, eventId]);

  /** Handle select mentor */
  // const handleSelect = (value: string) => {
  //   const mentor = mentors.find((item) => item._id === value);
  //   if (mentor) {
  //     setMentor(mentor);
  //   }
  // };

  /** Handle remove mentor */
  const handleRemove = useCallback(
    (mentorId: string) => {
      callApi(`mentor/${mentorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.tokens.accessToken}`,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userInfo.tokens]
  );

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
    [userInfo.tokens]
  );

  if (isLoading && eventId === Constants.EventId.Init) {
    return (
      <>
        <Loader />
      </>
    );
  }

  if (mentors && mentors.length === 0) {
    return (
      <NoItem>
        <CreateContainer setEventId={setEventId} setMentors={setMentors} />
      </NoItem>
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
        renderDetailInfo={() =>
          mentor && (
            <>
              <MentorInfo mentor={mentor} />
              {mentor.roles === Constants.Role.Mentor &&
                mentor.status === Constants.Status.Active && (
                  <>
                    <AssignPanel mentor={mentor} />
                  </>
                )}
            </>
          )
        }
        renderTopControl={() => (
          <>
            <Buttons.SwitchButton filter={filter} setFilter={setFilter} />
            <Buttons.ReloadButton />
            <CreateContainer setEventId={setEventId} setMentors={setMentors} />
          </>
        )}
        renderItemList={() => (
          <MentorList
            mentors={mentors}
            limit={limit}
            setMentors={setMentors}
            setEventId={setEventId}
          />
        )}
        renderPagination={() => (
          <Pagination
            paginationRange={setPaginationRange()}
            currentPage={page}
            handlePaging={handlePaging}
          />
        )}
      />
      {isShowToastMsg && <ToastMsgWrapper toastMsgObj={toastMsgObj} />}
    </>
  );
};

export default MentorContainer;

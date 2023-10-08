import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { FormikContext, useFormik } from "formik";
import { Mentor } from "../../commons/model";
import {
  Typography,
  ConfirmModal,
  AssignContainer,
  UnassignMentorList,
  Search,
  Pagination,
} from "../../commons/components";
import { EventId, PAGE_LIMIT, Prefix } from "../../commons/constants";
import {
  isResponseSuccessfully,
  serializedAssignResponseArray,
} from "../../commons/utils";
import {
  useCallApi,
  useAuthContext,
  useToastMessage,
  usePagination,
  useSearch,
} from "../../hooks";

type Props = {
  classroomId: string;
};

type FormikProps = {
  checked: string[];
};

const UnassignedMentorList: FC<Props> = ({ classroomId }) => {
  const [records, setRecords] = useState<Mentor[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(PAGE_LIMIT);
  const [grossCnt, setGrossCnt] = useState<number>(0);
  const [eventId, setEventId] = useState<EventId>(EventId.Init);
  const { signinToken } = useAuthContext();
  const { setToastMessage, setErrorToastMessage, ToastMessage } =
    useToastMessage();
  const { callApi, response, isLoading, error, GET, PATCH } = useCallApi<
    Mentor[]
  >([]);
  const { paginationRange } = usePagination({
    limit,
    grossCnt,
  });
  const { queryString, handleSearch } = useSearch(
    callApi,
    `mentor/classroom-unassign?id=${classroomId}&`,
    GET(signinToken.accessToken),
    setEventId
  );

  /** Call API at init */
  useEffect(() => {
    callApi(
      `mentor/classroom-unassign?id=${classroomId}&page=${page}&limit=${limit}`,
      GET(signinToken.accessToken)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Check reponse */
  useEffect(() => {
    if (isResponseSuccessfully(response)) {
      if (eventId === EventId.Assign) {
        const updated = serializedAssignResponseArray<Mentor, Mentor>(
          records,
          response.data,
          Prefix.Mentor
        );
        setGrossCnt(grossCnt - response.data.length);
        setToastMessage(Prefix.Mentor, EventId.Assign);
        setEventId(EventId.Init);
        return setRecords(updated as Mentor[]);
      }

      if (eventId === EventId.Search) {
        setGrossCnt(PAGE_LIMIT);
      } else {
        setGrossCnt(response.grossCnt || 0);
      }

      setRecords(response.data as Mentor[]);
    } else {
      if (error) {
        setEventId(EventId.Init);
        setErrorToastMessage(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, response]);

  /** handle unassign one student per request */
  const handleAssign = useCallback(
    (value: string) => {
      const data = {
        selectedIds: value.split(","),
      };

      callApi(
        `assign/classroom/assign-mentor/${classroomId}`,
        PATCH(signinToken.accessToken, data)
      );

      setEventId(EventId.Assign);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** handle unassing multiple students per request */
  const handleAssignAll = useCallback(
    (values: FormikProps) => {
      const data = {
        selectedIds: values.checked,
      };

      callApi(
        `assign/classroom/assign-mentor/${classroomId}`,
        PATCH(signinToken.accessToken, data)
      );

      setEventId(EventId.Assign);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** Formik */
  const formikBag = useFormik({
    initialValues: { checked: [] } as FormikProps,
    onSubmit: (values) => handleAssignAll(values),
  });

  /** Handle submit */
  const handleSubmit = useCallback(() => {
    try {
      formikBag.submitForm();
    } catch (error) {
      console.log(error);
    }
  }, [formikBag]);

  /** Handle paging */
  const handlePaging = useCallback(
    (page: number) => {
      setEventId(EventId.Paging);
      callApi(
        `mentor/classroom-unassign?id=${classroomId}&page=${page}&limit=${limit}`,
        GET(signinToken.accessToken)
      );
      setPage(page);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  const isChecked = useMemo(() => {
    return formikBag.values.checked && formikBag.values.checked.length > 0;
  }, [formikBag.values.checked]);

  const isDisableSearchInput = useMemo(() => {
    return (
      eventId !== EventId.Search &&
      !queryString &&
      records &&
      records.length === 0
    );
  }, [records, eventId, queryString]);

  return (
    <>
      <ToastMessage />
      <FormikContext.Provider value={formikBag}>
        <AssignContainer
          searchInput={
            <Search
              handleSearch={handleSearch}
              value={queryString}
              disabled={isDisableSearchInput}
            />
          }
          list={
            <UnassignMentorList
              records={records as Mentor[]}
              handleAssign={handleAssign}
              setEventId={setEventId}
              eventId={eventId}
              queryString={queryString}
              prefix={Prefix.Student}
            />
          }
          pagination={
            records && records.length > 0 ? (
              <Pagination
                paginationRange={paginationRange}
                currentPage={page}
                handlePaging={handlePaging}
              />
            ) : (
              <></>
            )
          }
          button={
            <ConfirmModal
              title="Confirm"
              label="Assign all"
              handleSubmit={handleSubmit}
              setEventId={setEventId}
              disabled={!isChecked}
            >
              <Typography
                text={`Assign all selected students?`}
                type="name"
                size="normal"
              />
            </ConfirmModal>
          }
          isLoading={isLoading}
        />
      </FormikContext.Provider>
    </>
  );
};

export default UnassignedMentorList;

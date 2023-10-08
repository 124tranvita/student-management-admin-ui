import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { FormikContext, useFormik } from "formik";
import { AssignClassroomMentor } from "../../commons/model";
import {
  Typography,
  ConfirmModal,
  Pagination,
  Search,
  AssignContainer,
  AssignClassroomList,
} from "../../commons/components";
import { EventId, PAGE_LIMIT, Prefix } from "../../commons/constants";
import {
  isResponseSuccessfully,
  serializedUnassignResponseArray,
} from "../../commons/utils";
import {
  useCallApi,
  useAuthContext,
  usePagination,
  useToastMessage,
  useSearch,
} from "../../hooks";

type Props = {
  mentorId: string;
};

type FormikProps = {
  checked: string[];
};

const AssignedClassroomList: FC<Props> = ({ mentorId }) => {
  const [records, setRecords] = useState<AssignClassroomMentor[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(PAGE_LIMIT);
  const [grossCnt, setGrossCnt] = useState<number>(0);
  const [eventId, setEventId] = useState<EventId>(EventId.Init);
  const { signinToken } = useAuthContext();
  const { setToastMessage, setErrorToastMessage, ToastMessage } =
    useToastMessage();
  const { callApi, response, isLoading, error, GET, PATCH } = useCallApi<
    AssignClassroomMentor[]
  >([]);
  const { paginationRange } = usePagination({
    limit,
    grossCnt,
  });
  const { queryString, handleSearch } = useSearch(
    callApi,
    `assign/mentor/classroom-to-mentor?id=${mentorId}&`,
    GET(signinToken.accessToken),
    setEventId
  );

  /** Call API at init */
  useEffect(() => {
    callApi(
      `assign/mentor/classroom-to-mentor?id=${mentorId}&page=${page}&limit=${limit}`,
      GET(signinToken.accessToken)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Check reponse */
  useEffect(() => {
    if (isResponseSuccessfully(response)) {
      if (eventId === EventId.Unassign) {
        const updated = serializedUnassignResponseArray<AssignClassroomMentor>(
          records,
          response.data
        );
        setGrossCnt(grossCnt - response.data.length);
        setToastMessage(Prefix.Student, EventId.Unassign);
        setEventId(EventId.Init);
        return setRecords(updated as AssignClassroomMentor[]);
      }

      if (eventId === EventId.Search) {
        setGrossCnt(PAGE_LIMIT);
      } else {
        setGrossCnt(response.grossCnt || 0);
      }

      setRecords(response.data);
    }
    {
      if (error) {
        setEventId(EventId.Init);
        setErrorToastMessage(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

  /** handle unassign one student per request */
  const handleUnAssign = useCallback(
    (value: string) => {
      const data = {
        assignedIds: value.split(","),
      };

      callApi(
        `assign/mentor/unassign-classroom/${mentorId}`,
        PATCH(signinToken.accessToken, data)
      );

      setEventId(EventId.Unassign);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** handle unassing multiple students per request */
  const handleUnAssignAll = useCallback(
    (values: FormikProps) => {
      const data = {
        assignedIds: values.checked,
      };

      callApi(
        `assign/mentor/unassign-classroom/${mentorId}`,
        PATCH(signinToken.accessToken, data)
      );

      setEventId(EventId.Unassign);
      formikBag.resetForm();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** Formik */
  const formikBag = useFormik({
    initialValues: { checked: [] } as FormikProps,
    onSubmit: (values) => handleUnAssignAll(values),
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
        `assign/mentor/classroom-to-mentor?id=${mentorId}&page=${page}&limit=${limit}`,
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
            <AssignClassroomList
              records={records}
              handleUnAssign={handleUnAssign}
              setEventId={setEventId}
              eventId={eventId}
              queryString={queryString}
              prefix={Prefix.Classroom}
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
              label="Unassign all"
              handleSubmit={handleSubmit}
              setEventId={setEventId}
              disabled={!isChecked}
            >
              <Typography
                text={`Unassign all selected classrooms?`}
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

export default AssignedClassroomList;

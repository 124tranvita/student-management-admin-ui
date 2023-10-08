import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { FormikContext, useFormik } from "formik";
import { AssignStudentMentor, Student } from "../../commons/model";
import {
  Typography,
  ConfirmModal,
  Pagination,
  Search,
  AssignContainer,
  UnassignStudentList,
} from "../../commons/components";
import { EventId, PAGE_LIMIT, Prefix } from "../../commons/constants";
import {
  isResponseSuccessfully,
  serializedAssignResponseArray,
} from "../../commons/utils";
import {
  useCallApi,
  usePagination,
  useAuthContext,
  useToastMessage,
  useSearch,
} from "../../hooks";

type Props = {
  mentorId: string;
};

type FormikProps = {
  checked: string[];
};

const UnassignedStudentList: FC<Props> = ({ mentorId }) => {
  const [records, setRecords] = useState<Student[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(PAGE_LIMIT);
  const [grossCnt, setGrossCnt] = useState<number>(0);
  const [eventId, setEventId] = useState<EventId>(EventId.Init);
  const { signinToken } = useAuthContext();
  const { setToastMessage, setErrorToastMessage, ToastMessage } =
    useToastMessage();
  const { callApi, response, isLoading, error, GET, PATCH } = useCallApi<
    Student[] | AssignStudentMentor[]
  >([]);
  const { paginationRange } = usePagination({
    limit,
    grossCnt,
  });
  const { queryString, handleSearch } = useSearch(
    callApi,
    `student/unassign?`,
    GET(signinToken.accessToken),
    setEventId
  );

  /** Call API at init */
  useEffect(() => {
    callApi(
      `student/unassign?page=${page}&limit=${limit}`,
      GET(signinToken.accessToken)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Check reponse */
  useEffect(() => {
    if (isResponseSuccessfully(response)) {
      if (eventId === EventId.Assign) {
        const updated = serializedAssignResponseArray<
          Student,
          AssignStudentMentor
        >(records, response.data as AssignStudentMentor[], Prefix.Student);
        setGrossCnt(grossCnt - response.data.length);
        setToastMessage(Prefix.Student, EventId.Assign);
        setEventId(EventId.Init);
        return setRecords(updated as Student[]);
      }

      if (eventId === EventId.Search) {
        setGrossCnt(PAGE_LIMIT);
      } else {
        setGrossCnt(response.grossCnt || 0);
      }

      setRecords(response.data as Student[]);
    } else {
      if (error) {
        setEventId(EventId.Init);
        setErrorToastMessage(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

  /** handle assign one student per request */
  const handleAssign = useCallback(
    (value: string) => {
      const data = {
        studentIds: value.split(","),
      };

      callApi(
        `assign/mentor/assign-student/${mentorId}`,
        PATCH(signinToken.accessToken, data)
      );

      setEventId(EventId.Assign);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** handle assing multiple students per request */
  const handleAssignAll = useCallback(
    (values: FormikProps) => {
      const data = {
        studentIds: values.checked,
      };

      callApi(
        `assign/mentor/assign-student/${mentorId}`,
        PATCH(signinToken.accessToken, data)
      );

      setEventId(EventId.Assign);
      formikBag.resetForm();
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
        `student/unassign?page=${page}&limit=${limit}`,
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
            <UnassignStudentList
              records={records as Student[]}
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

export default UnassignedStudentList;

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Form, FormikContext, useFormik } from "formik";
import { AssignStudentMentor, Student } from "../../commons/model";
import {
  Typography,
  ListItemAvatar,
  AssignListWrapper,
  AssignListItemControl,
  FormikCheckbox,
  ComponentLoader,
  ConfirmModal,
  Pagination,
  Search,
} from "../../commons/components";
import { isBefore } from "../../commons/date-func";
import { EventId, PAGE_LIMIT, Prefix } from "../../commons/constants";
import {
  getGender,
  getStatus,
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

const UnassignStudentList: FC<Props> = ({ mentorId }) => {
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
      <span className="mr-2">
        <Search
          handleSearch={handleSearch}
          value={queryString}
          disabled={isDisableSearchInput}
        />
      </span>
      {isLoading ? (
        <>
          <ComponentLoader />
        </>
      ) : (
        <>
          <FormikContext.Provider value={formikBag}>
            <ul className="h-50vh overflow-auto">
              {records && records.length > 0 ? (
                records
                  .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
                  .slice(0, PAGE_LIMIT)
                  .map((item, index) => (
                    <AssignListWrapper key={index}>
                      <ListItemAvatar img={item.avatar}>
                        <div>
                          <Typography
                            text={item.name}
                            type="name"
                            size="normal"
                          />
                          <Typography
                            text={`${item.studentId} - ${getStatus(
                              item.status
                            )}`}
                            type="muted"
                            size="small"
                          />
                        </div>
                      </ListItemAvatar>
                      <div className="w-16">
                        <Typography text="Gender" type="name" size="small" />
                        <Typography
                          text={getGender(item.gender)}
                          type="muted"
                          size="small"
                        />
                      </div>
                      <Form>
                        <FormikCheckbox name="checked" value={item._id}>
                          {""}
                        </FormikCheckbox>
                      </Form>
                      <AssignListItemControl
                        handleAssign={() => handleAssign(item._id)}
                        setEventId={setEventId}
                        name={item.name}
                      />
                    </AssignListWrapper>
                  ))
              ) : (
                <div className="flex justify-center items-center place-items-center relative p-4">
                  {eventId === EventId.Search || queryString ? (
                    <div>No result was found.</div>
                  ) : (
                    <div>All students are assigned.</div>
                  )}
                </div>
              )}
            </ul>
            <div className="">
              <Pagination
                paginationRange={paginationRange}
                currentPage={page}
                handlePaging={handlePaging}
              />
            </div>
            <div style={{ marginTop: "-2.6rem" }}>
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
            </div>
          </FormikContext.Provider>
        </>
      )}
    </>
  );
};

export default UnassignStudentList;

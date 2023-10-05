import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Form, FormikContext, useFormik } from "formik";
import { AssignStudentMentor } from "../../commons/model";
import {
  Typography,
  ListItemAvatar,
  AssignListWrapper,
  UnAssignListItemControl,
  FormikCheckbox,
  ComponentLoader,
  ConfirmModal,
  Pagination,
  Search,
} from "../../commons/components";
import { isBefore } from "../../commons/date-func";
import { EventId, PAGE_LIMIT, Prefix } from "../../commons/constants";
import {
  getStatus,
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

const AssignedStudentList: FC<Props> = ({ mentorId }) => {
  const [records, setRecords] = useState<AssignStudentMentor[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(PAGE_LIMIT);
  const [grossCnt, setGrossCnt] = useState<number>(0);
  const [eventId, setEventId] = useState<EventId>(EventId.Init);
  const { signinToken } = useAuthContext();
  const { setToastMessage, setErrorToastMessage, ToastMessage } =
    useToastMessage();
  const { callApi, response, isLoading, error, GET, PATCH } = useCallApi<
    AssignStudentMentor[]
  >([]);
  const { paginationRange } = usePagination({
    limit,
    grossCnt,
  });
  const { queryString, handleSearch } = useSearch(
    callApi,
    `assign/mentor/student-to-mentor?id=${mentorId}&`,
    GET(signinToken.accessToken),
    setEventId
  );

  /** Call API at init */
  useEffect(() => {
    callApi(
      `assign/mentor/student-to-mentor?id=${mentorId}&page=${page}&limit=${limit}`,
      GET(signinToken.accessToken)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Check reponse */
  useEffect(() => {
    if (isResponseSuccessfully(response)) {
      if (eventId === EventId.Unassign) {
        const updated = serializedUnassignResponseArray<AssignStudentMentor>(
          records,
          response.data
        );
        setGrossCnt(grossCnt - response.data.length);
        setToastMessage(Prefix.Student, EventId.Unassign);
        setEventId(EventId.Init);
        return setRecords(updated as AssignStudentMentor[]);
      }

      if (eventId === EventId.Search) {
        setGrossCnt(PAGE_LIMIT);
      } else {
        setGrossCnt(response.grossCnt || 0);
      }

      setRecords(response.data);
    } else {
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
        `assign/mentor/unassign-student/${mentorId}`,
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
        `assign/mentor/unassign-student/${mentorId}`,
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
        `assign/mentor/student-to-mentor?id=${mentorId}&page=${page}&limit=${limit}`,
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
                  .sort((a, b) =>
                    isBefore(a.assignedAt, b.assignedAt) ? 1 : -1
                  )
                  .slice(0, PAGE_LIMIT)
                  .map((item, index) => (
                    <AssignListWrapper key={index}>
                      <ListItemAvatar img={item.studentAvatar}>
                        <div>
                          <Typography
                            text={item.studentName}
                            type="name"
                            size="normal"
                          />
                          <Typography
                            text={`${item.studentId} - ${getStatus(
                              item.studentStatus
                            )}`}
                            type="muted"
                            size="small"
                          />
                        </div>
                      </ListItemAvatar>
                      <div className="w-16">
                        <Typography text="Mentor" type="name" size="small" />
                        <Typography
                          text={item.mentorName}
                          type="muted"
                          size="small"
                        />
                      </div>
                      <Form>
                        <FormikCheckbox name="checked" value={item._id}>
                          {""}
                        </FormikCheckbox>
                      </Form>
                      <UnAssignListItemControl
                        handleUnAssign={() => handleUnAssign(item._id)}
                        setEventId={setEventId}
                        name={item.studentName}
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
                label="Unassign all"
                handleSubmit={handleSubmit}
                setEventId={setEventId}
                disabled={!isChecked}
              >
                <Typography
                  text={`Unassign all selected students?`}
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

export default AssignedStudentList;

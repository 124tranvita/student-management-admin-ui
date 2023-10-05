import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Form, FormikContext, useFormik } from "formik";
import { AssignClassroomMentor, Classroom } from "../../commons/model";
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
  capitalize,
  isResponseSuccessfully,
  serializedAssignResponseArray,
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

const UnassignClassroomList: FC<Props> = ({ mentorId }) => {
  const [records, setRecords] = useState<Classroom[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(PAGE_LIMIT);
  const [grossCnt, setGrossCnt] = useState<number>(0);
  const [eventId, setEventId] = useState<EventId>(EventId.Init);
  const { signinToken } = useAuthContext();
  const { setToastMessage, setErrorToastMessage, ToastMessage } =
    useToastMessage();
  const { callApi, response, isLoading, error, GET, PATCH } = useCallApi<
    Classroom[] | AssignClassroomMentor[]
  >([]);
  const { paginationRange } = usePagination({
    limit,
    grossCnt,
  });
  const { queryString, handleSearch } = useSearch(
    callApi,
    `classroom/unassign-mentor?id=${mentorId}&`,
    GET(signinToken.accessToken),
    setEventId
  );

  /** Call API at init */
  useEffect(() => {
    callApi(
      `classroom/unassign-mentor?id=${mentorId}&page=${page}&limit=${limit}`,
      GET(signinToken.accessToken)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Check reponse */
  useEffect(() => {
    if (isResponseSuccessfully(response)) {
      if (eventId === EventId.Assign) {
        const updated = serializedAssignResponseArray<
          Classroom,
          AssignClassroomMentor
        >(records, response.data as AssignClassroomMentor[], Prefix.Classroom);
        setGrossCnt(grossCnt - response.data.length);
        setToastMessage(Prefix.Classroom, EventId.Assign);
        return setRecords(updated as Classroom[]);
      }

      if (eventId === EventId.Search) {
        setGrossCnt(PAGE_LIMIT);
      } else {
        setGrossCnt(response.grossCnt || 0);
      }

      setRecords(response.data as Classroom[]);
    } else {
      if (error) {
        setEventId(EventId.Init);
        setErrorToastMessage(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

  console.log({ records });

  /** Handle assign one classroom per request */
  const handleAssign = useCallback(
    (value: string) => {
      const data = {
        selectedIds: value.split(","),
      };

      callApi(
        `assign/mentor/assign-classroom/${mentorId}`,
        PATCH(signinToken.accessToken, data)
      );

      setEventId(EventId.Assign);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** Handle assign multiple students per request */
  const handleAssignAll = useCallback(
    (values: FormikProps) => {
      const data = {
        selectedIds: values.checked,
      };

      callApi(
        `assign/mentor/assign-classroom/${mentorId}`,
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
        `classroom/unassign-mentor?id=${mentorId}&page=${page}&limit=${limit}`,
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
                      <div className="w-full flex justify-between">
                        <div style={{ flex: "3" }}>
                          <ListItemAvatar img={item.cover}>
                            <div>
                              <Typography
                                text={item.name}
                                type="name"
                                size="normal"
                              />
                              <Typography
                                text={capitalize(item.description || "")}
                                type="muted"
                                size="small"
                              />
                            </div>
                          </ListItemAvatar>
                        </div>
                        <div style={{ flex: "2" }}>
                          <Typography text="Mentors" type="name" size="small" />
                          <Typography
                            text={`${item.assignedMentor}/25`}
                            type="muted"
                            size="small"
                          />
                        </div>
                        <div style={{ flex: "1" }}>
                          <Form>
                            <FormikCheckbox name="checked" value={item._id}>
                              {""}
                            </FormikCheckbox>
                          </Form>
                        </div>

                        <AssignListItemControl
                          handleAssign={() => handleAssign(item._id)}
                          setEventId={setEventId}
                          name={item.name}
                        />
                      </div>
                    </AssignListWrapper>
                  ))
              ) : (
                <div className="flex justify-center items-center place-items-center relative p-4">
                  {eventId === EventId.Search || queryString ? (
                    <div>No result was found.</div>
                  ) : (
                    <div>All classsrooms are assigned.</div>
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

export default UnassignClassroomList;

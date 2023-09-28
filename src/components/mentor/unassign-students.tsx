import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Form, FormikContext, useFormik } from "formik";
import { Student } from "../../commons/model";
import {
  Typography,
  ListItemAvatar,
  AssignListWrapper,
  AssignListItemControl,
  FormikCheckbox,
  ComponentLoader,
  NoAssign,
  ConfirmModal,
  Pagination,
  ToastMsgWrapper,
} from "../../commons/components";
import { isBefore } from "../../commons/date-func";
import { EventId, PAGE_LIMIT } from "../../commons/constants";
import {
  getGender,
  getResponeMsg,
  getStatus,
  isResponseSuccessfully,
  serializedAssignResponseArray,
} from "../../commons/utils";
import useCallApi from "../../hooks/useCallApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import usePagination from "../../hooks/usePagination";

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
  const [eventId, setEventId] = useState<EventId>(EventId.Init);
  const [grossCnt, setGrossCnt] = useState<number>(0);
  const [isShowToastMsg, setIsShowToastMsg] = useState<boolean>(false);

  const { signinToken } = useAuthContext();
  const { callApi, response, isLoading, error } = useCallApi<Student[]>([]);

  const { paginationRange } = usePagination({
    limit,
    grossCnt,
  });

  /** Call API at init */
  useEffect(() => {
    callApi(`student/unassign?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${signinToken.accessToken}`,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Check reponse */
  useEffect(() => {
    if (isResponseSuccessfully(response)) {
      if (eventId === EventId.Init || eventId === EventId.Paging) {
        setGrossCnt(response.grossCnt || 0);
        setRecords(response.data);
      }

      if (eventId === EventId.Assign) {
        const updated = serializedAssignResponseArray(
          records,
          response.data,
          "student"
        );
        setGrossCnt(grossCnt - response.data.length);
        setIsShowToastMsg(true);
        return setRecords(updated as Student[]);
      }

      setIsShowToastMsg(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, response]);

  /** handle unassign one student per request */
  const handleAssign = useCallback((value: string) => {
    const data = {
      studentIds: value.split(","),
    };

    callApi(`assign/mentor/assign-student/${mentorId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${signinToken.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setEventId(EventId.Assign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** handle unassing multiple students per request */
  const handleAssignAll = useCallback((values: FormikProps) => {
    const data = {
      studentIds: values.checked,
    };

    callApi(`assign/mentor/assign-student/${mentorId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${signinToken.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setEventId(EventId.Assign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      msg: getResponeMsg("student", eventId),
    };
  }, [error, response.status, eventId]);

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
      callApi(`student/unassign?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${signinToken.accessToken}`,
        },
      });
      setPage(page);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  const isChecked = useMemo(() => {
    return formikBag.values.checked && formikBag.values.checked.length > 0;
  }, [formikBag.values.checked]);

  if (isLoading) {
    return (
      <>
        <ComponentLoader />
      </>
    );
  }

  if (records && records.length === 0) {
    return (
      <>
        {isShowToastMsg && <ToastMsgWrapper toastMsgObj={toastMsgObj} />}
        <NoAssign content="All students are assigned" />
      </>
    );
  }

  return (
    <>
      {isShowToastMsg && <ToastMsgWrapper toastMsgObj={toastMsgObj} />}

      <FormikContext.Provider value={formikBag}>
        <ul className="h-90per overflow-auto">
          {records &&
            records.length > 0 &&
            records
              .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
              .slice(0, PAGE_LIMIT)
              .map((item, index) => (
                <AssignListWrapper key={index}>
                  <ListItemAvatar img={item.avatar}>
                    <div className="w-64">
                      <Typography text={item.name} type="name" size="normal" />
                      <Typography
                        text={`${item.studentId} - ${getStatus(item.status)}`}
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
              ))}
        </ul>
        <div className="">
          <Pagination
            paginationRange={paginationRange}
            currentPage={page}
            handlePaging={handlePaging}
          />
        </div>
        <div style={{ marginTop: "-32px" }}>
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
  );
};

export default UnassignStudentList;

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
  NoAssign,
  ConfirmModal,
  ToastMsgWrapper,
  Pagination,
} from "../../commons/components";
import { isBefore } from "../../commons/date-func";
import { EventId, PAGE_LIMIT } from "../../commons/constants";
import {
  getResponeMsg,
  getStatus,
  isResponseSuccessfully,
  serializedDeleteResponseArray,
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

const AssignedStudentList: FC<Props> = ({ mentorId }) => {
  const [records, setRecords] = useState<AssignStudentMentor[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(PAGE_LIMIT);
  const [eventId, setEventId] = useState<EventId>(EventId.Init);
  const [grossCnt, setGrossCnt] = useState<number>(0);
  const [isShowToastMsg, setIsShowToastMsg] = useState<boolean>(false);

  const { signinToken } = useAuthContext();
  const { callApi, response, isLoading, error } = useCallApi<
    AssignStudentMentor[]
  >([]);

  const { paginationRange } = usePagination({
    limit,
    grossCnt,
  });

  /** Call API at init */
  useEffect(() => {
    callApi(
      `assign/mentor/student-to-mentor?id=${mentorId}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${signinToken.accessToken}`,
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Check reponse */
  useEffect(() => {
    if (isResponseSuccessfully(response)) {
      if (eventId === EventId.Init || eventId === EventId.Paging) {
        setGrossCnt(response.grossCnt || 0);
        setRecords(response.data);
      }

      if (eventId === EventId.Unassign) {
        const updated = serializedDeleteResponseArray(records, response.data);
        setGrossCnt(grossCnt - response.data.length);
        setIsShowToastMsg(true);
        return setRecords(updated as AssignStudentMentor[]);
      }

      setIsShowToastMsg(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, response]);

  /** handle unassign one student per request */
  const handleUnAssign = useCallback((value: string) => {
    const data = {
      assignedIds: value.split(","),
    };

    callApi(`assign/mentor/unassign-student/${mentorId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${signinToken.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setEventId(EventId.Unassign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** handle unassing multiple students per request */
  const handleUnAssignAll = useCallback((values: FormikProps) => {
    const data = {
      assignedIds: values.checked,
    };

    callApi(`assign/mentor/unassign-student/${mentorId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${signinToken.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setEventId(EventId.Unassign);
    // alert(JSON.stringify(values, null, 2));
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
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${signinToken.accessToken}`,
          },
        }
      );
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
        <NoAssign content="Mentor has no assinged student" />
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
              .sort((a, b) => (isBefore(a.assignedAt, b.assignedAt) ? 1 : -1))
              .slice(0, PAGE_LIMIT)
              .map((item, index) => (
                <AssignListWrapper key={index}>
                  <ListItemAvatar img={item.studentAvatar}>
                    <div className="w-64">
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
                    <FormikCheckbox name="checked" value={item.id}>
                      {""}
                    </FormikCheckbox>
                  </Form>
                  <UnAssignListItemControl
                    handleUnAssign={() => handleUnAssign(item.id)}
                    setEventId={setEventId}
                    name={item.studentName}
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
  );
};

export default AssignedStudentList;

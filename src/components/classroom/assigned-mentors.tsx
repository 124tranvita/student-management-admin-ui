import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Form, FormikContext, useFormik } from "formik";
import { AssignClassroomMentor } from "../../commons/model";
import {
  Typography,
  ListItemAvatar,
  AssignListWrapper,
  UnAssignListItemControl,
  FormikCheckbox,
  ComponentLoader,
  NoAssign,
  ConfirmModal,
} from "../../commons/components";
import { isBefore } from "../../commons/date-func";
import { EventId } from "../../commons/constants";
import {
  getStatus,
  isResponseSuccessfully,
  serializedDeleteResponseArray,
} from "../../commons/utils";
import useCallApi from "../../hooks/useCallApi";
import { useAuthContext } from "../../hooks/useAuthContext";

type Props = {
  classroomId: string;
};

type FormikProps = {
  checked: string[];
};

const AssignedMentorList: FC<Props> = ({ classroomId }) => {
  const [records, setRecords] = useState<AssignClassroomMentor[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [eventId, setEventId] = useState<EventId>(EventId.Init);

  const { signinToken } = useAuthContext();
  const { callApi, response, isLoading, error } = useCallApi<
    AssignClassroomMentor[]
  >([]);

  /** Call API at init */
  useEffect(() => {
    callApi(
      `assign/classroom/mentor-to-classroom?id=${classroomId}&page=${page}&limit=${limit}`,
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
      if (eventId === EventId.Init) {
        setRecords(records.concat(response.data));
      }

      if (eventId === EventId.Unassign) {
        const updated = serializedDeleteResponseArray(records, response.data);
        return setRecords(updated as AssignClassroomMentor[]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, response]);

  /** handle unassign one student per request */
  const handleUnAssign = useCallback((value: string) => {
    const data = {
      assignedIds: value.split(","),
    };

    callApi(`assign/classroom/unassign-mentor/${classroomId}`, {
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

    callApi(`assign/classroom/unassign-mentor/${classroomId}`, {
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
    return <NoAssign content="Classroom has no assinged mentor" />;
  }

  return (
    <FormikContext.Provider value={formikBag}>
      <ul className="h-90per overflow-auto">
        {records &&
          records.length > 0 &&
          records
            .sort((a, b) => (isBefore(a.assignedAt, b.assignedAt) ? 1 : -1))
            .slice(0, limit)
            .map((item, index) => (
              <AssignListWrapper key={index}>
                <ListItemAvatar
                  img={
                    item.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/4128/4128405.png"
                  }
                >
                  <div className="w-64">
                    <Typography
                      text={item.assignee}
                      type="name"
                      size="normal"
                    />
                    <Typography
                      text={`${item.email} - ${getStatus(item.status || "")}`}
                      type="muted"
                      size="small"
                    />
                  </div>
                </ListItemAvatar>
                <div className="w-16">
                  <Typography text="Classroom" type="name" size="small" />
                  <Typography text={item.name} type="muted" size="small" />
                </div>
                <Form>
                  <FormikCheckbox name="checked" value={item._id}>
                    {""}
                  </FormikCheckbox>
                </Form>
                <UnAssignListItemControl
                  handleUnAssign={() => handleUnAssign(item._id)}
                  setEventId={setEventId}
                  name={item.assignee}
                />
              </AssignListWrapper>
            ))}
      </ul>
      <div>
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
  );
};

export default AssignedMentorList;

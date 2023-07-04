import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Form, FormikContext, useFormik } from "formik";
import { Classroom, Student } from "../../commons/model";
import {
  Typography,
  ListItemAvatar,
  AssignListWrapper,
  AssignListItemControl,
  FormikCheckbox,
  ComponentLoader,
  NoAssign,
  ConfirmModal,
} from "../../commons/components";
import { isBefore } from "../../commons/date-func";
import { EventId } from "../../commons/constants";
import {
  capitalize,
  getGender,
  getStatus,
  isResponseSuccessfully,
  serializedAssignResponseArray,
} from "../../commons/utils";
import useCallApi from "../../hooks/useCallApi";

type Props = {
  mentorId: string;
};

type FormikProps = {
  checked: string[];
};

/** TODO: Implement authentication */
const refreshToken = "dasdasdasdasdas";

const UnassignClassroomList: FC<Props> = ({ mentorId }) => {
  const [records, setRecords] = useState<Classroom[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [eventId, setEventId] = useState<EventId>(EventId.Init);

  const { callApi, response, isLoading, error } = useCallApi<Classroom[]>([]);

  console.log({ response });
  console.log({ assignPanel: error });

  /** Call API at init */
  useEffect(() => {
    callApi(`classroom/unassign-mentor?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Check reponse */
  useEffect(() => {
    if (isResponseSuccessfully(response)) {
      if (eventId === EventId.Init) {
        setRecords(records.concat(response.data));
      }

      if (eventId === EventId.Assign) {
        const updated = serializedAssignResponseArray(records, response.data);
        return setRecords(updated as Classroom[]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, response]);

  /** handle unassign one student per request */
  const handleAssign = useCallback((value: string) => {
    const data = {
      classroomIds: value.split(","),
    };

    callApi(`assign/mentor/assign-student/${mentorId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
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
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setEventId(EventId.Assign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    return <NoAssign content="All students are assigned" />;
  }

  return (
    <FormikContext.Provider value={formikBag}>
      <ul className="h-90per overflow-auto">
        {records &&
          records.length > 0 &&
          records
            .sort((a, b) => (isBefore(a.createdAt, b.createdAt) ? 1 : -1))
            .slice(0, limit)
            .map((item, index) => (
              <AssignListWrapper key={index}>
                <ListItemAvatar img={item.cover}>
                  <div className="w-64">
                    <Typography text={item.name} type="name" size="normal" />
                    <Typography
                      text={capitalize(item.description)}
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
                  <FormikCheckbox name="checked" value={item.id}>
                    {""}
                  </FormikCheckbox>
                </Form>
                <AssignListItemControl
                  handleAssign={() => handleAssign(item.id)}
                  setEventId={setEventId}
                  name={item.name}
                />
              </AssignListWrapper>
            ))}
      </ul>
      <div>
        <ConfirmModal
          title="Confirm"
          label="Assign all"
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

export default UnassignClassroomList;

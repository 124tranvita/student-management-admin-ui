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
  capitalize,
  isResponseSuccessfully,
  serializedDeleteResponseArray,
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

const AssignedClassroomList: FC<Props> = ({ mentorId }) => {
  const [records, setRecords] = useState<AssignClassroomMentor[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [eventId, setEventId] = useState<EventId>(EventId.Init);

  const { callApi, response, isLoading, error } = useCallApi<
    AssignClassroomMentor[]
  >([]);

  console.log({ response });

  /** Call API at init */
  useEffect(() => {
    callApi(
      `assign/mentor/classroom-to-mentor?id=${mentorId}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
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

    callApi(`assign/mentor/unassign-classroom/${mentorId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
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

    callApi(`assign/mentor/unassign-classroom/${mentorId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setEventId(EventId.Unassign);
    // alert(JSON.stringify(values, null, 2));
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
    return <NoAssign content="Mentor has no assinged classroom" />;
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
                <ListItemAvatar img={item.classroomCover}>
                  <div className="w-64">
                    <Typography
                      text={item.classroomName}
                      type="name"
                      size="normal"
                    />
                    <Typography
                      text={capitalize(item.classroomDesc || "")}
                      type="muted"
                      size="small"
                    />
                  </div>
                </ListItemAvatar>
                <div className="w-16">
                  <Typography text="Languages" type="name" size="small" />
                  <div className="flex">
                    {item.classroomLanguages[0] &&
                      item.classroomLanguages.map(
                        (item: string, index: number) => (
                          <span className="mr-1">
                            <Typography
                              key={index}
                              text={`${item}`}
                              type="muted"
                              size="small"
                            />
                          </span>
                        )
                      )}
                  </div>
                </div>
                <Form>
                  <FormikCheckbox name="checked" value={item.id}>
                    {""}
                  </FormikCheckbox>
                </Form>
                <UnAssignListItemControl
                  handleUnAssign={() => handleUnAssign(item.id)}
                  setEventId={setEventId}
                  name={item.classroomName}
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
            text={`Unassign all selected classrooms?`}
            type="name"
            size="normal"
          />
        </ConfirmModal>
      </div>
    </FormikContext.Provider>
  );
};

export default AssignedClassroomList;

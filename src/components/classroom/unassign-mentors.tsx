import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Form, FormikContext, useFormik } from "formik";
import { Mentor } from "../../commons/model";
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
  getStatus,
  isResponseSuccessfully,
  serializedAssignResponseArray,
} from "../../commons/utils";
import useCallApi from "../../hooks/useCallApi";
import { Status } from "../mentor/constants";
import { useAuthContext } from "../../hooks/useAuthContext";

type Props = {
  classroomId: string;
};

type FormikProps = {
  checked: string[];
};

const UnassignMentorList: FC<Props> = ({ classroomId }) => {
  const [records, setRecords] = useState<Mentor[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [eventId, setEventId] = useState<EventId>(EventId.Init);

  const { signinToken } = useAuthContext();
  const { callApi, response, isLoading, error } = useCallApi<Mentor[]>([]);

  /** Call API at init */
  useEffect(() => {
    callApi(
      `mentor/classroom-unassign?id=${classroomId}&page=${page}&limit=${limit}`,
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

      if (eventId === EventId.Assign) {
        const updated = serializedAssignResponseArray(
          records,
          response.data,
          "mentor"
        );
        return setRecords(updated as Mentor[]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, response]);

  /** handle unassign one student per request */
  const handleAssign = useCallback((value: string) => {
    const data = {
      selectedIds: value.split(","),
    };

    callApi(`assign/classroom/assign-mentor/${classroomId}`, {
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
      selectedIds: values.checked,
    };

    callApi(`assign/classroom/assign-mentor/${classroomId}`, {
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
    return <NoAssign content="All mentors are assigned" />;
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
                <ListItemAvatar img={item.avatar}>
                  <div className="w-64">
                    <Typography text={item.name} type="name" size="normal" />
                    <Typography
                      text={`${item.email} - ${getStatus(item.status)}`}
                      type="muted"
                      size="small"
                    />
                  </div>
                </ListItemAvatar>

                {item.status === Status.Active && (
                  <>
                    <div className="w-16">
                      <Typography text="Languages" type="name" size="small" />
                      <div className="flex">
                        {item.languages[0] &&
                          item.languages.map((item: string, index: number) => (
                            <span className="mr-1">
                              <Typography
                                key={index}
                                text={`${item}`}
                                type="muted"
                                size="small"
                              />
                            </span>
                          ))}
                      </div>
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
                  </>
                )}
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
            text={`Assign all selected students?`}
            type="name"
            size="normal"
          />
        </ConfirmModal>
      </div>
    </FormikContext.Provider>
  );
};

export default UnassignMentorList;

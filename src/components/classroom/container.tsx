import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { FormikContext, useFormik } from "formik";
import {
  Wrapper,
  AddFormModal,
  AbsContainer,
  NavigatePanel,
  Loader,
  ComponentLoader,
  Pagination,
  Buttons,
} from "../../commons/components";
import { Classroom, classroomInitial } from "../../commons/model";
import {
  isNotNullData,
  isResponseSuccessfully,
  serializedDeleteResponse,
  serializedPatchResponse,
} from "../../commons/utils";
import useCallApi from "../../hooks/useCallApi";
import * as Constants from "../../commons/constants";
import usePagination from "../../hooks/usePagination";
import ClassroomList from "./classroom-list";
import { createValidationSchema } from "./validatation-schema";
import { ClassroomFormikProps, classroomFormikInitial } from "./types";
import CreateForm from "./create-form";
import ClassroomInfo from "./classroom-info";
import { createValidateSubmission } from "./validate-submission";
import AssignPanel from "./assign-panel";
import NoItem from "./no-item";
import useTitle from "../../hooks/useTitle";

/** TODO: Implement authentication */
const refreshToken = "dasdasdasdasdas";

// import mentors from "../../assets/dev/mentors";

const Classroom: FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroom, setClassroom] = useState<Classroom>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);
  const [eventId, setEventId] = useState<Constants.EventId>(
    Constants.EventId.Init
  );

  const { setTitle } = useTitle();
  const { callApi, response, isLoading, error } = useCallApi<
    Classroom[] | Classroom
  >([] || classroomInitial);
  const { paginationRange } = usePagination({
    limit,
    grossCnt: response.grossCnt || 0,
  });

  console.log({ response });
  /** Get mentor list at init */
  useEffect(() => {
    setTitle("Classrooms");
    callApi(`classroom?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Check API response and set mentors data base on event type*/
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      if (eventId === Constants.EventId.Add) {
        return setClassrooms(classrooms.concat(response.data));
      }

      if (eventId === Constants.EventId.Update) {
        const updated = serializedPatchResponse(classrooms, response.data);
        setClassroom(response.data as Classroom);
        return setClassrooms(updated);
      }

      if (eventId === Constants.EventId.Delete) {
        const updated = serializedDeleteResponse(classrooms, response.data);
        return setClassrooms(updated);
      }

      return setClassrooms(response.data as Classroom[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  useEffect(() => {
    if (
      eventId === Constants.EventId.Update ||
      eventId === Constants.EventId.Delete
    )
      return;
    if (classrooms && classrooms.length > 0) {
      setClassroom(classrooms[0]);
    }
  }, [classrooms, eventId]);

  /** Create Submit */
  const onSubmit = useCallback((values: ClassroomFormikProps) => {
    const data = {
      name: values.name,
      description: values.description,
      languages: values.languages.replace(/' '/g, "").split(","),
      cover: values.cover,
    };

    callApi("classroom", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    formikBag.resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Update Submit */
  const onUpdate = useCallback((values: ClassroomFormikProps) => {
    const data = {
      name: values.name,
      description: values.description,
      languages: values.languages.replace(/' '/g, "").split(","),
      cover: values.cover,
    };

    callApi(`classroom/${values.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    formikBag.resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Set component loading screen*/
  const isComponentLoading = useMemo(() => {
    return (
      isLoading &&
      ((isLoading && eventId === Constants.EventId.Add) ||
        eventId === Constants.EventId.Update ||
        eventId === Constants.EventId.Delete ||
        eventId === Constants.EventId.Paging)
    );
  }, [isLoading, eventId]);
  /** Formik initial values*/
  const initialValues: ClassroomFormikProps = useMemo(() => {
    if (classroom && eventId === Constants.EventId.Update)
      return {
        id: classroom.id,
        name: classroom.name,
        description: classroom.description,
        languages: classroom.languages.toString(),
        cover: classroom.cover,
      };

    return classroomFormikInitial;
  }, [classroom, eventId]);

  /** Formik bag */
  const formikBag = useFormik({
    initialValues,
    validate: (values) => createValidateSubmission(values, eventId, classroom),
    validateOnBlur: false,
    validationSchema: () => createValidationSchema(),
    onSubmit: (values) =>
      eventId === Constants.EventId.Add ? onSubmit(values) : onUpdate(values),
  });

  /** Set formik initial values */
  useEffect(() => {
    formikBag.setValues(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  /** Handle submit */
  const handleSubmit = useCallback(() => {
    try {
      formikBag.submitForm();
    } catch (error) {
      console.log(error);
    }
  }, [formikBag]);

  /** Handle update */
  const handleUpdate = useCallback(() => {
    try {
      formikBag.submitForm();
    } catch (error) {
      console.log(error);
    }
  }, [formikBag]);

  /** Handle select mentor */
  const handleSelect = (value: string) => {
    const classroom = classrooms.find((item) => item.id === value);
    if (classroom) {
      setClassroom(classroom);
    }
  };

  /** Handle remove mentor */
  const handleRemove = useCallback((mentorId: string) => {
    callApi(`classroom/${mentorId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Handle paging */
  const handlePaging = useCallback((page: number) => {
    setEventId(Constants.EventId.Paging);
    callApi(`classroom?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    setPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && eventId === Constants.EventId.Init) {
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );
  }

  if (classrooms && classrooms.length === 0) {
    return (
      <>
        <NoItem>
          <FormikContext.Provider value={formikBag}>
            <AddFormModal
              title="Add new classroom"
              type="add"
              handleSubmit={handleSubmit}
              setEventId={setEventId}
            >
              <CreateForm />
            </AddFormModal>
          </FormikContext.Provider>
        </NoItem>
      </>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Error...</h1>
      </div>
    );
  }
  return (
    <Wrapper>
      {/* Left Panel */}
      <div className="relative w-1/4">
        <NavigatePanel
          path={[{ name: "Classrooms", to: "/classroom", destiny: true }]}
        />
        {classroom && (
          <>
            <ClassroomInfo classroom={classroom} />
            {/* <AssignPanel mentor={mentor} /> */}
          </>
        )}
      </div>

      {/* Right Panel */}
      <FormikContext.Provider value={formikBag}>
        <div className="relative w-3/4 p-4">
          {isComponentLoading ? (
            <div className="relative h-full">
              <ComponentLoader />
            </div>
          ) : (
            <>
              <ClassroomList
                classrooms={classrooms}
                selectedId={classroom ? classroom.id : ""}
                limit={limit}
                handleUpdate={handleUpdate}
                handleRemove={handleRemove}
                handleSelect={handleSelect}
                setEventId={setEventId}
              />
            </>
          )}
          <AbsContainer variant="top-right">
            {isLoading && eventId === Constants.EventId.Add ? (
              <div className="absolute top-4 right-1">
                <Buttons.ButtonLoader variant="primary" />
              </div>
            ) : (
              <AddFormModal
                title="Add new classroom"
                type="add"
                handleSubmit={handleSubmit}
                setEventId={setEventId}
              >
                <CreateForm />
              </AddFormModal>
            )}
          </AbsContainer>
          <div className="absolute -bottom-24 left-0 right-0">
            <Pagination
              paginationRange={paginationRange}
              currentPage={page}
              handlePaging={handlePaging}
            />
          </div>
        </div>
      </FormikContext.Provider>
    </Wrapper>
  );
};

export default Classroom;

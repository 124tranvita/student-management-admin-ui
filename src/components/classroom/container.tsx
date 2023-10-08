import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { FormikContext, useFormik } from "formik";
import {
  AddFormModal,
  Loader,
  ComponentLoader,
  Pagination,
  Buttons,
  ListWrapper,
  Search,
  RightContainer,
  LeftContainer,
} from "../../commons/components";
import { Classroom, classroomInitial } from "../../commons/model";
import {
  checkIsComponentLoading,
  isResponseSuccessfully,
  serializedDeleteResponse,
  serializedPatchResponse,
  storeHistory,
} from "../../commons/utils";
import * as Constants from "../../commons/constants";
import {
  usePagination,
  useCallApi,
  useTitle,
  useAuthContext,
  useToastMessage,
  useSearch,
} from "../../hooks";
import ClassroomList from "./classroom-list";
import { createValidationSchema } from "./validatation-schema";
import { createValidateSubmission } from "./validate-submission";
import { ClassroomFormikProps, classroomFormikInitial } from "./types";
import CreateForm from "./create-form";
import ClassroomInfo from "./classroom-info";
import NoItem from "./no-item";

const Classroom: FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroom, setClassroom] = useState<Classroom>();
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(Constants.PAGE_LIMIT);
  const [grossCnt, setGrossCnt] = useState<number>(0);
  const [eventId, setEventId] = useState<Constants.EventId>(
    Constants.EventId.Init
  );
  const { signinToken } = useAuthContext();
  const { setTitle } = useTitle();
  const { setToastMessage, setErrorToastMessage, ToastMessage } =
    useToastMessage();
  const { callApi, response, isLoading, error, GET, POST, PATCH, DELETE } =
    useCallApi<Classroom[] | Classroom>([] || classroomInitial);
  const { paginationRange } = usePagination({
    limit,
    grossCnt,
  });
  const { queryString, handleSearch } = useSearch(
    callApi,
    `classroom?`,
    GET(signinToken.accessToken),
    setEventId
  );

  /** Set component loading screen*/
  const isComponentLoading = useMemo(() => {
    return checkIsComponentLoading(eventId, isLoading);
  }, [isLoading, eventId]);

  /** Formik initial values*/
  const initialValues: ClassroomFormikProps = useMemo(() => {
    if (classroom)
      return {
        id: classroom._id,
        name: classroom.name,
        description: classroom.description,
        languages: classroom.languages.toString(),
        cover: classroom.cover,
      };

    return classroomFormikInitial;
  }, [classroom]);

  /** Call init Api */
  useEffect(() => {
    storeHistory("/classroom");
    setTitle("Classrooms");
    callApi(
      `classroom?page=${page}&limit=${limit}`,
      GET(signinToken.accessToken)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Check API response and set mentors data base on event type*/
  useEffect(() => {
    if (isResponseSuccessfully(response)) {
      formikBag.resetForm();
      if (eventId === Constants.EventId.Add) {
        setGrossCnt(grossCnt + 1);
        setToastMessage(Constants.Prefix.Classroom, Constants.EventId.Add);
        setEventId(Constants.EventId.None);
        return setClassrooms(classrooms.concat(response.data));
      }

      if (eventId === Constants.EventId.Update) {
        const updated = serializedPatchResponse<Classroom>(
          classrooms,
          response.data as Classroom
        );
        setClassroom(response.data as Classroom);
        setToastMessage(Constants.Prefix.Classroom, Constants.EventId.Update);
        setEventId(Constants.EventId.None);
        return setClassrooms(updated);
      }

      if (eventId === Constants.EventId.Delete) {
        const updated = serializedDeleteResponse<Classroom>(
          classrooms,
          response.data as Classroom
        );
        setGrossCnt(grossCnt - 1);
        setToastMessage(Constants.Prefix.Classroom, Constants.EventId.Delete);
        setEventId(Constants.EventId.None);
        return setClassrooms(updated);
      }

      if (eventId === Constants.EventId.Search) {
        setGrossCnt(Constants.PAGE_LIMIT);
      } else {
        setGrossCnt(response.grossCnt || 0);
      }

      return setClassrooms(response.data as Classroom[]);
    } else {
      if (error) {
        setEventId(Constants.EventId.None);
        setErrorToastMessage(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

  useEffect(() => {
    if (
      eventId === Constants.EventId.Init &&
      classrooms &&
      classrooms.length > 0
    ) {
      setClassroom(classrooms[0]);
    }
  }, [classrooms, eventId]);

  /** Create Submit */
  const onSubmit = useCallback(
    (values: ClassroomFormikProps) => {
      const data = {
        name: values.name,
        description: values.description,
        languages: values.languages.replace(/' '/g, "").split(","),
        cover: values.cover,
      };

      callApi("classroom", POST(signinToken.accessToken, data));

      formikBag.resetForm();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** Update Submit */
  const onUpdate = useCallback(
    (values: ClassroomFormikProps) => {
      const data = {
        name: values.name,
        description: values.description,
        languages: values.languages.replace(/' '/g, "").split(","),
        cover: values.cover,
      };

      callApi(`classroom/${values.id}`, PATCH(signinToken.accessToken, data));

      formikBag.resetForm();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

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
    const classroom = classrooms.find((item) => item._id === value);
    if (classroom) {
      setClassroom(classroom);
    }
  };

  /** Handle remove mentor */
  const handleRemove = useCallback(
    (mentorId: string) => {
      callApi(`classroom/${mentorId}`, DELETE(signinToken.accessToken));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** Handle paging */
  const handlePaging = useCallback(
    (page: number) => {
      setEventId(Constants.EventId.Paging);
      callApi(
        `classroom?page=${page}&limit=${limit}`,
        GET(signinToken.accessToken)
      );
      setPage(page);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** Loading screen */
  if (isLoading && eventId === Constants.EventId.Init) {
    return (
      <>
        <Loader />
      </>
    );
  }

  /** If no have data in response on init display */
  if (
    classrooms &&
    classrooms.length === 0 &&
    eventId === Constants.EventId.Init
  ) {
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

  return (
    <>
      <ToastMessage />
      {/* Left Panel */}
      <LeftContainer
        detail={classroom && <ClassroomInfo classroom={classroom} />}
      />

      {/* Right Panel */}
      <FormikContext.Provider value={formikBag}>
        <RightContainer
          upperBtn={
            <>
              <span className="mr-2">
                <Search handleSearch={handleSearch} value={queryString} />
              </span>
              <span className="mr-2">
                <Buttons.ReloadButton />
              </span>
              <AddFormModal
                title="Add new classroom"
                type="add"
                handleSubmit={handleSubmit}
                setEventId={setEventId}
              >
                <CreateForm />
              </AddFormModal>
            </>
          }
          list={
            isComponentLoading ? (
              <div className="relative h-full">
                <ComponentLoader />
              </div>
            ) : (
              <ListWrapper>
                <ClassroomList
                  classrooms={classrooms}
                  selectedId={classroom ? classroom._id : ""}
                  limit={limit}
                  handleUpdate={handleUpdate}
                  handleRemove={handleRemove}
                  handleSelect={handleSelect}
                  setEventId={setEventId}
                />
              </ListWrapper>
            )
          }
          pagination={
            <Pagination
              paginationRange={paginationRange}
              currentPage={page}
              handlePaging={handlePaging}
            />
          }
        />
      </FormikContext.Provider>
    </>
  );
};

export default Classroom;

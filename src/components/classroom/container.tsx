import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { FormikContext, useFormik } from "formik";
import {
  AddFormModal,
  AbsContainer,
  NavigatePanel,
  Loader,
  ComponentLoader,
  Pagination,
  Buttons,
  ListWrapper,
  Search,
} from "../../commons/components";
import { Classroom, classroomInitial } from "../../commons/model";
import {
  isResponseSuccessfully,
  serializedDeleteResponse,
  serializedPatchResponse,
  storeHistory,
} from "../../commons/utils";
import * as Constants from "../../commons/constants";
import usePagination from "../../hooks/usePagination";
import useCallApi from "../../hooks/useCallApi";
import useTitle from "../../hooks/useTitle";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useToastMessage } from "../../hooks/useToastMessage";
import ClassroomList from "./classroom-list";
import { createValidationSchema } from "./validatation-schema";
import { ClassroomFormikProps, classroomFormikInitial } from "./types";
import CreateForm from "./create-form";
import ClassroomInfo from "./classroom-info";
import { createValidateSubmission } from "./validate-submission";
import AssignPanel from "./assign-panel";
import NoItem from "./no-item";
import { useSearch } from "../../hooks/useSearch";

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
  const { handleSearch } = useSearch(
    callApi,
    `classroom?page=${page}&limit=${99}`,
    GET(signinToken.accessToken),
    setEventId
  );

  /** Set component loading screen*/
  const isComponentLoading = useMemo(() => {
    return (
      isLoading &&
      ((isLoading && eventId === Constants.EventId.Add) ||
        eventId === Constants.EventId.Update ||
        eventId === Constants.EventId.Delete ||
        eventId === Constants.EventId.Paging ||
        eventId === Constants.EventId.Search)
    );
  }, [isLoading, eventId]);

  /** Formik initial values*/
  const initialValues: ClassroomFormikProps = useMemo(() => {
    if (classroom && eventId === Constants.EventId.Update)
      return {
        id: classroom._id,
        name: classroom.name,
        description: classroom.description,
        languages: classroom.languages.toString(),
        cover: classroom.cover,
      };

    return classroomFormikInitial;
  }, [classroom, eventId]);

  /** Call init Api */
  useEffect(() => {
    storeHistory("/classroom");
    setTitle("Classrooms");
    callApi(`classroom?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${signinToken.accessToken}`,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Call Api base on search query */
  useEffect(() => {
    setEventId(Constants.EventId.Search);

    callApi(
      `classroom${
        queryString ? `/search?queryString=${searchQuery}&` : "?"
      }page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${signinToken.accessToken}`,
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  /** Check API response and set mentors data base on event type*/
  useEffect(() => {
    if (isResponseSuccessfully(response)) {
      formikBag.resetForm();

      if (eventId === Constants.EventId.Add) {
        setGrossCnt(grossCnt + 1);
        setQueryString("");
        setToastMessage(Constants.Prefix.Classroom, Constants.EventId.Add);
        setEventId(Constants.EventId.None);
        return setClassrooms(classrooms.concat(response.data));
      }

      if (eventId === Constants.EventId.Update) {
        const updated = serializedPatchResponse(classrooms, response.data);
        setClassroom(response.data as Classroom);
        setToastMessage(Constants.Prefix.Classroom, Constants.EventId.Update);
        setEventId(Constants.EventId.None);
        return setClassrooms(updated);
      }

      if (eventId === Constants.EventId.Delete) {
        const updated = serializedDeleteResponse(classrooms, response.data);
        setGrossCnt(grossCnt - 1);
        setToastMessage(Constants.Prefix.Classroom, Constants.EventId.Delete);
        setEventId(Constants.EventId.None);
        return setClassrooms(updated);
      }

      if (eventId === Constants.EventId.Search) {
        /** Search flag in case no result on search query */
        if (response.data instanceof Array && response.data.length === 0) {
          setIsNoSearchResult(true);
          return;
        }
        setIsNoSearchResult(false);
      }

      setGrossCnt(response.grossCnt || 0);
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
        Authorization: `Bearer ${signinToken.accessToken}`,
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
        Authorization: `Bearer ${signinToken.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    formikBag.resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const handleRemove = useCallback((mentorId: string) => {
    callApi(`classroom/${mentorId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${signinToken.accessToken}`,
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
        Authorization: `Bearer ${signinToken.accessToken}`,
      },
    });
    setPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && eventId === Constants.EventId.Init) {
    return (
      <>
        <Loader />
      </>
    );
  }

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
      <div className="relative w-1/4">
        <NavigatePanel
          path={[{ name: "Classrooms", to: "/classroom", destiny: true }]}
        />
        {classroom && (
          <>
            <ClassroomInfo classroom={classroom} />
            <AssignPanel classroom={classroom} />
          </>
        )}
      </div>

      {/* Right Panel */}
      <FormikContext.Provider value={formikBag}>
        <div className="relative w-3/4 p-4 h-75vh">
          {isComponentLoading ? (
            <div className="relative h-full">
              <ComponentLoader />
            </div>
          ) : (
            <ListWrapper disabled={isNoSearchResult}>
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
          )}
          <AbsContainer variant="top-right">
            <span className="mr-2">
              <Search
                queryString={queryString}
                setQueryString={setQueryString}
              />
            </span>
            <span className="mr-2">
              <Buttons.ReloadButton />
            </span>
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
    </>
  );
};

export default Classroom;

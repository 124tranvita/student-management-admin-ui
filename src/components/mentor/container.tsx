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
import { Mentor, mentorInitial } from "../../commons/model";
import {
  checkIsComponentLoading,
  isResponseSuccessfully,
  serializedDeleteResponse,
  serializedPatchResponse,
  storeHistory,
} from "../../commons/utils";
import * as Constants from "../../commons/constants";
import {
  useCallApi,
  usePagination,
  useTitle,
  useLoginInfContext,
  useAuthContext,
  useToastMessage,
  useSearch,
} from "../../hooks";
import MentorList from "./mentor-list";
import { MentorFormikProps, mentorFormikInitial } from "./types";
import CreateForm from "./create-form";
import MentorInfo from "./mentor-info";
import NoItem from "./no-item";
import { createValidationSchema } from "./validatation-schema";
import { createValidateSubmission } from "./validate-submission";
import { Status } from "./constants";

const Mentor: FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentor, setMentor] = useState<Mentor>();
  const [filter, setFilter] = useState<string>("0");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(Constants.PAGE_LIMIT);
  const [grossCnt, setGrossCnt] = useState<number>(0);
  const [eventId, setEventId] = useState<Constants.EventId>(
    Constants.EventId.Init
  );
  const { signinToken } = useAuthContext();
  const { loginInf } = useLoginInfContext();
  const { setTitle } = useTitle();
  const { setToastMessage, setErrorToastMessage, ToastMessage } =
    useToastMessage();
  const { callApi, response, isLoading, error, GET, POST, PATCH, DELETE } =
    useCallApi<Mentor[] | Mentor>([] || mentorInitial);
  const { paginationRange } = usePagination({
    limit,
    grossCnt,
  });
  const { queryString, handleSearch } = useSearch(
    callApi,
    `mentor?id=${loginInf.sub}&role=${filter}&`,
    GET(signinToken.accessToken),
    setEventId
  );

  /** Check loading style */
  const isComponentLoading = useMemo(() => {
    return checkIsComponentLoading(eventId, isLoading);
  }, [isLoading, eventId]);

  /** Declare formik initial values */
  const initialValues: MentorFormikProps = useMemo(() => {
    if (mentor)
      return {
        id: mentor._id,
        email: mentor.email,
        name: mentor.name,
        languages: mentor.languages.toString(),
        education: mentor.education,
        specialized: mentor.specialized,
        avatar: mentor.avatar,
        roles: mentor.roles,
        status: mentor.status,
      };

    return mentorFormikInitial;
  }, [mentor]);

  /** Call init Api */
  useEffect(() => {
    setEventId(Constants.EventId.Init);
    storeHistory("/mentor");
    setTitle("Mentors");
    callApi(
      `mentor?id=${loginInf.sub}&role=${filter}&page=${page}&limit=${limit}`,
      GET(signinToken.accessToken)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginInf.sub, filter]);

  /** Check API response and set mentors data base on event type*/
  useEffect(() => {
    formikBag.resetForm();
    if (isResponseSuccessfully(response)) {
      if (eventId === Constants.EventId.Add) {
        setGrossCnt(grossCnt + 1);
        setToastMessage(Constants.Prefix.Mentor, Constants.EventId.Add);
        setEventId(Constants.EventId.None);
        return setMentors(mentors.concat(response.data));
      }

      if (eventId === Constants.EventId.Update) {
        const updated = serializedPatchResponse<Mentor>(
          mentors,
          response.data as Mentor
        );
        setMentor(response.data as Mentor);
        setToastMessage(Constants.Prefix.Mentor, Constants.EventId.Update);
        setEventId(Constants.EventId.None);
        return setMentors(updated);
      }

      if (eventId === Constants.EventId.Delete) {
        const updated = serializedDeleteResponse<Mentor>(
          mentors,
          response.data as Mentor
        );
        setGrossCnt(grossCnt - 1);
        setToastMessage(Constants.Prefix.Mentor, Constants.EventId.Delete);
        setEventId(Constants.EventId.None);
        return setMentors(updated);
      }

      if (eventId === Constants.EventId.Search) {
        setGrossCnt(Constants.PAGE_LIMIT);
      } else {
        setGrossCnt(response.grossCnt || 0);
      }

      return setMentors(response.data as Mentor[]);
    } else {
      if (error) {
        setEventId(Constants.EventId.None);
        setErrorToastMessage(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

  /** Get the 1st mentor for the init display/switch view on left panel */
  useEffect(() => {
    if (eventId === Constants.EventId.Init && mentors && mentors.length > 0) {
      setMentor(mentors[0]);
    }
  }, [mentors, eventId, filter]);

  /** Create Submit */
  const onCreate = useCallback(
    (values: MentorFormikProps) => {
      const data = {
        email: values.email,
        name: values.name,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
        languages: values.languages.replace(/' '/g, "").split(","),
        education: values.education,
        specialized: values.specialized,
        status: Status.Active,
        avatar: values.avatar,
        roles: values.roles,
      };

      callApi("mentor", POST(signinToken.accessToken, data));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** Update Submit */
  const onUpdate = useCallback(
    (values: MentorFormikProps) => {
      const data = {
        email: values.email,
        name: values.name,
        languages: values.languages.replace(/' '/g, "").split(","),
        education: values.education,
        specialized: values.specialized,
        status: values.status,
        avatar: values.avatar,
        roles: values.roles,
      };

      callApi(`mentor/${values.id}`, PATCH(signinToken.accessToken, data));

      formikBag.resetForm();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** Formik bag */
  const formikBag = useFormik({
    initialValues,
    validate: (values) => createValidateSubmission(values, eventId, mentor),
    validateOnBlur: false,
    validationSchema: () => createValidationSchema(eventId),
    onSubmit: (values) =>
      eventId === Constants.EventId.Add ? onCreate(values) : onUpdate(values),
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
    const mentor = mentors.find((item) => item._id === value);
    if (mentor) {
      setMentor(mentor);
    }
  };

  /** Handle remove mentor */
  const handleRemove = useCallback(
    (mentorId: string) => {
      callApi(`mentor/${mentorId}`, DELETE(signinToken.accessToken));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signinToken.accessToken]
  );

  /** Handle paging */
  const handlePaging = useCallback(
    (page: number) => {
      setEventId(Constants.EventId.Paging);
      callApi(
        `mentor?id=${loginInf.sub}&role=${filter}&page=${page}&limit=${limit}`,
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
  if (mentors && mentors.length === 0 && eventId === Constants.EventId.Init) {
    return (
      <NoItem>
        <FormikContext.Provider value={formikBag}>
          <AddFormModal
            title="Add new mentor"
            type="add"
            handleSubmit={handleSubmit}
            setEventId={setEventId}
          >
            <CreateForm />
          </AddFormModal>
        </FormikContext.Provider>
      </NoItem>
    );
  }

  return (
    <>
      <ToastMessage />
      {/* Left Panel */}
      <LeftContainer detail={mentor && <MentorInfo mentor={mentor} />} />

      {/* Right Panel */}
      <FormikContext.Provider value={formikBag}>
        <RightContainer
          upperBtn={
            <>
              <span className="mr-2">
                <Search handleSearch={handleSearch} value={queryString} />
              </span>
              <span className="mr-2">
                <Buttons.SwitchButton filter={filter} setFilter={setFilter} />
              </span>
              <span className="mr-2">
                <Buttons.ReloadButton />
              </span>
              <AddFormModal
                title="Add new mentor"
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
                <MentorList
                  mentors={mentors}
                  selectedId={mentor ? mentor._id : ""}
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

export default Mentor;

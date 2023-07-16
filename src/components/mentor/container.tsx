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
import { Mentor, mentorInitial } from "../../commons/model";
import {
  isHttpStatusCode401,
  isNotNullData,
  isResponseSuccessfully,
  serializedDeleteResponse,
  serializedPatchResponse,
} from "../../commons/utils";
import * as Constants from "../../commons/constants";
import { statusCode401Handler } from "../../commons/errors-handler";
import useCallApi from "../../hooks/useCallApi";
import usePagination from "../../hooks/usePagination";
import useTitle from "../../hooks/useTitle";
import { useLoginInfContext } from "../../hooks/useLoginInfContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import MentorList from "./mentor-list";
import { createValidationSchema } from "./validatation-schema";
import { MentorFormikProps, mentorFormikInitial } from "./types";
import CreateForm from "./create-form";
import MentorInfo from "./mentor-info";
import AssignPanel from "./assign-panel";
import { createValidateSubmission } from "./validate-submission";
import NoItem from "./no-item";
import { Role, Status } from "./constants";

const Mentor: FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentor, setMentor] = useState<Mentor>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(Constants.PAGE_LIMIT);
  const [eventId, setEventId] = useState<Constants.EventId>(
    Constants.EventId.Init
  );

  const { signinToken, dispatchAuth } = useAuthContext();
  const { loginInf } = useLoginInfContext();
  const { setTitle } = useTitle();
  const { callApi, response, isLoading, error } = useCallApi<Mentor[] | Mentor>(
    [] || mentorInitial
  );

  const { paginationRange } = usePagination({
    limit,
    grossCnt: response.grossCnt || 0,
  });

  /** Get mentor list at init */
  useEffect(() => {
    setTitle("Mentors");
    callApi(`mentor?id=${loginInf.sub}&page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${signinToken.accessToken}`,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signinToken.accessToken]);

  /** Check API response and set mentors data base on event type*/
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      if (eventId === Constants.EventId.RenewToken) return;

      if (eventId === Constants.EventId.Add) {
        return setMentors(mentors.concat(response.data));
      }

      if (eventId === Constants.EventId.Update) {
        const updated = serializedPatchResponse(mentors, response.data);
        setMentor(response.data as Mentor);
        return setMentors(updated);
      }

      if (eventId === Constants.EventId.Delete) {
        const updated = serializedDeleteResponse(mentors, response.data);
        return setMentors(updated as Mentor[]);
      }

      return setMentors(response.data as Mentor[]);
    } else {
      if (error && isHttpStatusCode401(error)) {
        setEventId(Constants.EventId.RenewToken);
        statusCode401Handler(signinToken.refreshToken, dispatchAuth);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

  useEffect(() => {
    if (eventId === Constants.EventId.Update) return;
    if (mentors && mentors.length > 0) {
      setMentor(mentors[0]);
    }
  }, [mentors, eventId]);

  /** Create Submit */
  const onSubmit = useCallback((values: MentorFormikProps) => {
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

    callApi("mentor", {
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
  const onUpdate = useCallback((values: MentorFormikProps) => {
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

    callApi(`mentor/${values.id}`, {
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

  /** Set component loading screen*/
  const isComponentLoading = useMemo(() => {
    return (
      isLoading &&
      (eventId === Constants.EventId.Add ||
        eventId === Constants.EventId.Update ||
        eventId === Constants.EventId.Delete ||
        eventId === Constants.EventId.Paging)
    );
  }, [isLoading, eventId]);
  /** Formik initial values*/
  const initialValues: MentorFormikProps = useMemo(() => {
    if (mentor && eventId === Constants.EventId.Update)
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
  }, [mentor, eventId]);

  /** Formik bag */
  const formikBag = useFormik({
    initialValues,
    validate: (values) => createValidateSubmission(values, eventId, mentor),
    validateOnBlur: false,
    validationSchema: () => createValidationSchema(eventId),
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
    const mentor = mentors.find((item) => item._id === value);
    if (mentor) {
      setMentor(mentor);
    }
  };

  /** Handle remove mentor */
  const handleRemove = useCallback((mentorId: string) => {
    callApi(`mentor/${mentorId}`, {
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
    callApi(`mentor?page=${page}&limit=${limit}`, {
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
      <Wrapper>
        <Loader />
      </Wrapper>
    );
  }

  if (mentors && mentors.length === 0) {
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
          path={[{ name: "Mentors", to: "/mentor", destiny: true }]}
        />
        {mentor && (
          <>
            <MentorInfo mentor={mentor} />
            {mentor.roles === Role.Mentor &&
              mentor.status === Status.Active && (
                <>
                  <AssignPanel mentor={mentor} />
                </>
              )}
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
            <>
              <MentorList
                mentors={mentors}
                selectedId={mentor ? mentor._id : ""}
                limit={limit}
                handleUpdate={handleUpdate}
                handleRemove={handleRemove}
                handleSelect={handleSelect}
                setEventId={setEventId}
              />
            </>
          )}
          <AbsContainer variant="top-right">
            <Buttons.ReloadButton />
            {isLoading && eventId === Constants.EventId.Add ? (
              <div className="absolute top-4 right-1">
                <Buttons.ButtonLoader variant="primary" />
              </div>
            ) : (
              <AddFormModal
                title="Add new mentor"
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

export default Mentor;

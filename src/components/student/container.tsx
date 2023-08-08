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
  ListWrapper,
} from "../../commons/components";
import { Student, studentInitial } from "../../commons/model";
import {
  isHttpStatusCode401,
  isNotNullData,
  isResponseSuccessfully,
  serializedDeleteResponse,
  serializedPatchResponse,
} from "../../commons/utils";
import useCallApi from "../../hooks/useCallApi";
import * as Constants from "../../commons/constants";
import { dateFormatter } from "../../commons/time-func";
import { statusCode401Handler } from "../../commons/errors-handler";
import usePagination from "../../hooks/usePagination";
import useTitle from "../../hooks/useTitle";
import { useAuthContext } from "../../hooks/useAuthContext";
import StudentList from "./student-list";
import { createValidationSchema } from "./validatation-schema";
import { StudentFormikProps, studentFormikInitial } from "./types";
import CreateForm from "./create-form";
import { createValidateSubmission } from "./validate-submission";
import StudentInfo from "./student-info";
import NoItem from "./no-item";
import AssignPanel from "./assign-panel";

const Student: FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(Constants.PAGE_LIMIT);
  const [eventId, setEventId] = useState<Constants.EventId>(
    Constants.EventId.Init
  );

  const { signinToken, dispatchAuth } = useAuthContext();
  const { setTitle } = useTitle();
  const { callApi, response, isLoading, error } = useCallApi<
    Student[] | Student
  >([] || studentInitial);
  const { paginationRange } = usePagination({
    limit,
    grossCnt: response.grossCnt || 0,
  });

  /** Get mentor list at init */
  useEffect(() => {
    setTitle("Students");
    callApi(`student?page=${page}&limit=${limit}`, {
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
      if (eventId === Constants.EventId.Add) {
        return setStudents(students.concat(response.data));
      }

      if (eventId === Constants.EventId.Update) {
        const updated = serializedPatchResponse(students, response.data);
        setStudent(response.data as Student);
        return setStudents(updated);
      }

      if (eventId === Constants.EventId.Delete) {
        const updated = serializedDeleteResponse(students, response.data);
        return setStudents(updated);
      }

      return setStudents(response.data as Student[]);
    } else {
      if (error && isHttpStatusCode401(error)) {
        setEventId(Constants.EventId.RenewToken);
        statusCode401Handler(signinToken.refreshToken, dispatchAuth);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, error]);

  /** Set select the first item on list when init */
  useEffect(() => {
    if (
      eventId === Constants.EventId.Update ||
      eventId === Constants.EventId.Delete
    )
      return;
    if (students && students.length > 0) {
      setStudent(students[0]);
    }
  }, [students, eventId]);

  /** Create Submit */
  const onSubmit = useCallback((values: StudentFormikProps) => {
    const data = {
      studentId: values.studentId,
      name: values.name,
      doB: values.doB,
      address: values.address,
      gender: values.gender,
      languages: values.languages.replace(/' '/g, "").split(","),
      status: values.status,
      avatar: values.avatar,
      cover: values.cover,
    };

    callApi("student", {
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
  const onUpdate = useCallback((values: StudentFormikProps) => {
    const data = {
      name: values.name,
      doB: values.doB,
      address: values.address,
      gender: values.gender,
      languages: values.languages.replace(/' '/g, "").split(","),
      status: values.status,
      avatar: values.avatar,
      cover: values.cover,
    };

    callApi(`student/${values.id}`, {
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
      ((isLoading && eventId === Constants.EventId.Add) ||
        eventId === Constants.EventId.Update ||
        eventId === Constants.EventId.Delete ||
        eventId === Constants.EventId.Paging)
    );
  }, [isLoading, eventId]);

  /** Formik initial values*/
  const initialValues: StudentFormikProps = useMemo(() => {
    if (student && eventId === Constants.EventId.Update)
      return {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        doB: dateFormatter(student.doB, "yyyy-MM-dd"),
        address: student.address,
        gender: student.gender,
        languages: student.languages.toString(),
        status: student.status,
        avatar: student.avatar,
        cover: student.cover,
      };

    return studentFormikInitial;
  }, [student, eventId]);

  /** Formik bag */
  const formikBag = useFormik({
    initialValues,
    validate: (values) => createValidateSubmission(values, eventId, student),
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
    const student = students.find((item) => item._id === value);
    if (student) {
      setStudent(student);
    }
  };

  /** Handle remove mentor */
  const handleRemove = useCallback((mentorId: string) => {
    callApi(`student/${mentorId}`, {
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
    callApi(`student?page=${page}&limit=${limit}`, {
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

  if (students && students.length === 0) {
    return (
      <NoItem>
        <FormikContext.Provider value={formikBag}>
          <AddFormModal
            title="Add new student"
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
    <Wrapper>
      {/* Left Panel */}
      <div className="relative w-1/4">
        <NavigatePanel
          path={[{ name: "Students", to: "/student", destiny: true }]}
        />
        {student && (
          <>
            <StudentInfo
              student={student}
              accessToken={signinToken.accessToken}
            />
            <AssignPanel student={student} />
          </>
        )}
      </div>

      {/* Right Panel */}
      <FormikContext.Provider value={formikBag}>
        <div className="relative w-3/4 p-4 h-75vh">
          <AbsContainer variant="top-right">
            <span className="mr-2">
              <Buttons.ReloadButton />
            </span>
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
          {isComponentLoading ? (
            <div className="relative h-full">
              <ComponentLoader />
            </div>
          ) : (
            <ListWrapper>
              <StudentList
                students={students}
                selectedId={student ? student._id : ""}
                limit={limit}
                handleUpdate={handleUpdate}
                handleRemove={handleRemove}
                handleSelect={handleSelect}
                setEventId={setEventId}
              />
            </ListWrapper>
          )}

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

export default Student;

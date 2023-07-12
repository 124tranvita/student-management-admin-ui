import { FC, useCallback, useEffect } from "react";
import { FormikContext, useFormik } from "formik";
import { Wrapper, Loader } from "../../../commons/components";
import { SigninToken, signinTokenInitial } from "../../../commons/model";
import { isNotNullData, isResponseSuccessfully } from "../../../commons/utils";
import useCallApi from "../../../hooks/useCallApi";
import * as ActionType from "../../../context/constants";
import useTitle from "../../../hooks/useTitle";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { createValidationSchema } from "./validatation-schema";
import { SigninFormikProps, signinFormikInitial } from "./types";
import SigninForm from "./signin-form";
import { useNavigate } from "react-router-dom";

/** TODO: Implement authentication */
const refreshToken = "dasdasdasdasdas";

// import mentors from "../../assets/dev/mentors";

const Signin: FC = () => {
  const navigate = useNavigate();
  const { setTitle } = useTitle();
  const { dispatch } = useAuthContext();

  const { callApi, response, isLoading, error } =
    useCallApi<SigninToken>(signinTokenInitial);

  /** Set page title */
  useEffect(() => {
    setTitle("Sign in");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Check API response */
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      console.log({ response: response.data });
      // Store signin token to local storage
      localStorage.setItem("signinToken", JSON.stringify(response.data));

      // Set signin token to auth context
      dispatch({ type: ActionType.ACT_USER_LOGIN, payload: response.data });

      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  /** Sign in submit */
  const onSubmit = useCallback((values: SigninFormikProps) => {
    const data = {
      email: values.email,
      password: values.password,
    };

    callApi("auth/signin", {
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

  /** Formik bag */
  const formikBag = useFormik({
    initialValues: signinFormikInitial,
    // validate: (values) => createValidateSubmission(values, eventId, classroom),
    validateOnBlur: false,
    validationSchema: () => createValidationSchema(),
    onSubmit: (values) => onSubmit(values),
  });

  /** Handle submit */
  const handleSubmit = useCallback(() => {
    try {
      formikBag.submitForm();
    } catch (error) {
      console.log(error);
    }
  }, [formikBag]);

  if (isLoading) {
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
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
      <FormikContext.Provider value={formikBag}>
        <SigninForm />
        <button onClick={handleSubmit}>Submit</button>
      </FormikContext.Provider>
    </Wrapper>
  );
};

export default Signin;

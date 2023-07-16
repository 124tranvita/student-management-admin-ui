import { FC, useCallback, useEffect } from "react";
import { FormikContext, useFormik } from "formik";
import { Wrapper, Loader, FullContainer } from "../../../commons/components";
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
import { Button } from "../../../commons/components/buttons";

const Signin: FC = () => {
  const navigate = useNavigate();
  const { setTitle } = useTitle();
  const { dispatchAuth } = useAuthContext();

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
      dispatchAuth({ type: ActionType.ACT_USER_LOGIN, payload: response.data });

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
    <FullContainer>
      <FormikContext.Provider value={formikBag}>
        <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <div className="py-4 mb-3">
            <div className="text-3xl text-center font-semibold ">
              <span>Admin Panel</span>
            </div>
            <div className="text-sm text-center text-slate-400 ">
              <span>v1.0.0.1</span>
            </div>
          </div>

          <SigninForm />
          <div className="mx-3 text-center">
            <Button label="Singin" onClick={handleSubmit} variant="primary" />
          </div>
        </div>
      </FormikContext.Provider>
    </FullContainer>
  );
};

export default Signin;

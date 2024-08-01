import { FC, useCallback, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { FormikContext, useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AuthContainer, FullContainer } from "../../../commons/components";
import {
  SigninToken,
  signinTokenInitial,
  Decoded,
} from "../../../commons/model";
import * as Constants from "../../../context/constants";
import { isNotNullData, isResponseSuccessfully } from "../../../commons/utils";
import useCallApi from "../../../hooks/useCallApi";
import useSetTitle from "../../../hooks/useSetTitle";
import { useAuthContext } from "../../../hooks/useAuthContext";
import SigninForm from "./signin-form";
import { createValidationSchema } from "./validatation-schema";
import { SigninFormikProps, signinFormikInitial } from "./types";

const Signin: FC = () => {
  const navigate = useNavigate();
  const { dispatchAuth } = useAuthContext();
  const { callApi, response, isLoading, error } =
    useCallApi<SigninToken>(signinTokenInitial);

  /** Set page title */
  useSetTitle("Sign in");

  /** Check API response */
  useEffect(() => {
    if (isResponseSuccessfully(response) && isNotNullData(response.data)) {
      // Decode user info
      const decoded: Decoded = jwt_decode(response.data.accessToken);

      // Set login info to store
      dispatchAuth({
        type: Constants.ACT_USER_LOGIN,
        payload: {
          info: decoded,
          tokens: response.data,
        },
      });
      // Navigate to main page
      navigate("/mentor");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  /** onSubmit event handler */
  const onSubmit = useCallback((values: SigninFormikProps) => {
    // Make request data
    const data = {
      email: values.email,
      password: values.password,
    };

    // Call API
    callApi("auth/signin-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
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

  return (
    <FullContainer>
      <FormikContext.Provider value={formikBag}>
        <AuthContainer
          error={error}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        >
          <SigninForm />
        </AuthContainer>
      </FormikContext.Provider>
    </FullContainer>
  );
};

export default Signin;

import { FC, useCallback, useEffect, useState } from "react";
import { FormikContext, useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { FullContainer } from "../../../commons/components";
import { SigninToken, signinTokenInitial } from "../../../commons/model";
import { isNotNullData, isResponseSuccessfully } from "../../../commons/utils";
import useCallApi from "../../../hooks/useCallApi";
import useTitle from "../../../hooks/useTitle";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Button } from "../../../commons/components/buttons";
import { useSilentRefreshToken } from "../../../hooks/useSilentRefreshToken";
import { TOKEN_EXPIRY } from "../../../commons/constants";
import SigninForm from "./signin-form";
import { createValidationSchema } from "./validatation-schema";
import { SigninFormikProps, signinFormikInitial } from "./types";

const Signin: FC = () => {
  const navigate = useNavigate();
  const [refreshToken, setRefreshToken] = useState<string>("");
  const { setTitle } = useTitle();
  const { dispatchAuth } = useAuthContext();
  useSilentRefreshToken(refreshToken, TOKEN_EXPIRY, dispatchAuth);

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
      setRefreshToken(response.data.refreshToken);
      // Back to '/'
      navigate(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  /** Sign in submit */
  const onSubmit = useCallback((values: SigninFormikProps) => {
    const data = {
      email: values.email,
      password: values.password,
    };

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
        <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <div className="py-4 mb-3">
            <div className="text-3xl text-center font-semibold ">
              <span>Admin Panel</span>
            </div>
            <div className="text-sm text-center text-slate-400 mb-3 ">
              <span>v1.0.0.1</span>
            </div>
            {error && (
              <div className="text-sm font-semibold text-center text-red-400">
                <span>{error?.message}</span>
              </div>
            )}
            {isLoading && (
              <div className="flex items-center justify-center space-x-2 animate-bounce ">
                <div className="w-3 h-3 rounded-sm bg-blue-400 animate-spin"></div>
                <div className="w-3 h-3 rounded-sm bg-green-400 animate-spin"></div>
                <div className="w-3 h-3 rounded-sm bg-black animate-spin"></div>
              </div>
            )}
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

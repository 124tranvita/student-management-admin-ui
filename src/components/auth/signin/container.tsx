import { FC, useCallback, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Constants from "../../../context/constants";
import { Buttons } from "../../../commons/components";
import {
  SigninToken,
  signinTokenInitial,
  Decoded,
} from "../../../commons/model";
import { isNotNullData, isResponseSuccessfully } from "../../../commons/utils";
import useCallApi from "../../../hooks/useCallApi";
import useSetTitle from "../../../hooks/useSetTitle";
import { useAuthContext } from "../../../hooks/useAuthContext";
import SigninForm from "./signin-form";
import { validationSchema } from "./validatation-schema";
import { SigninFormType } from "./types";
import { SignPageContainer } from "../../../commons/components/ui";

const Signin: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SigninFormType>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  /** Custom hooks */
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

      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  /** onSubmit event handler */
  const onSubmit = useCallback((values: SigninFormType) => {
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

  return (
    <SignPageContainer error={error} isLoading={isLoading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SigninForm register={register} errors={errors} />
        <div className="mx-3 text-center">
          <Buttons.Button
            label="Singin"
            type="submit"
            variant="primary"
            disabled={isLoading}
          />
        </div>
      </form>
    </SignPageContainer>
  );
};

export default Signin;

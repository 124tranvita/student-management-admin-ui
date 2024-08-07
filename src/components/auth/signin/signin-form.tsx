import { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "../../../commons/hook-form-component";
import { SigninFormType } from "./types";

type Props = {
  register: UseFormRegister<SigninFormType>;
  errors: FieldErrors<SigninFormType>;
};

const SigninForm: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <Input
        label="Email"
        errors={errors}
        type="email"
        {...register("email")}
      />
      <Input
        label="Password"
        errors={errors}
        type="password"
        {...register("password")}
      />
    </>
  );
};

export default SigninForm;

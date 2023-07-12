import { Form } from "formik";
import { FC } from "react";
import { FormikTextInput } from "../../../commons/components";

const className =
  "bg-slate-50 dark:bg-slate-800 appearance-none border-b-1 border-gray-200 mb-3 w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-slate-100 focus:border-indigo-500";

const SigninForm: FC = () => {
  return (
    <Form>
      <FormikTextInput
        label="Email"
        name="email"
        type="text"
        className={className}
      />
      <FormikTextInput
        label="Password"
        name="password"
        type="password"
        className={className}
      />
    </Form>
  );
};

export default SigninForm;

import { Form } from "formik";
import { FC } from "react";
import { FormikSelect, FormikTextInput } from "../../commons/components";
import { Education, Role } from "./constants";

const className =
  "bg-slate-50 dark:bg-slate-800 appearance-none border-b-1 border-gray-200 mb-3 w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-slate-100 focus:border-indigo-500";

const CreateForm: FC = () => {
  return (
    <Form>
      <FormikTextInput
        label="Email"
        name="email"
        type="text"
        className={className}
      />
      <FormikTextInput
        label="Name"
        name="name"
        type="text"
        className={className}
      />
      <FormikTextInput
        label="Password"
        name="password"
        type="password"
        className={className}
      />
      <FormikTextInput
        label="Confirm Password"
        name="passwordConfirm"
        type="password"
        className={className}
      />
      <FormikTextInput
        label="Coding languages"
        name="languages"
        type="text"
        className={className}
      />
      <FormikSelect label="Education" name="education">
        <option value={Education.Bachelor}>Bachelor</option>
        <option value={Education.College}>College</option>
      </FormikSelect>
      <FormikTextInput
        label="Specialized"
        name="specialized"
        type="text"
        className={className}
      />
      <FormikTextInput
        label="Avatar"
        name="avatar"
        type="text"
        className={className}
      />
      <FormikSelect label="Role" name="roles">
        <option value={Role.mentor}>Mentor</option>
        <option value={Role.admin}>Admin</option>
      </FormikSelect>
    </Form>
  );
};

export default CreateForm;

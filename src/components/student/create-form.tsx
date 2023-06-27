import { Form } from "formik";
import { FC } from "react";
import { FormikSelect, FormikTextInput } from "../../commons/components";
import { Gender } from "./constants";

const className =
  "bg-slate-50 dark:bg-slate-800 appearance-none border-b-1 border-gray-200 mb-3 w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-slate-100 focus:border-indigo-500";

const CreateForm: FC = () => {
  return (
    <Form>
      <FormikTextInput
        label="Student Id"
        name="studentId"
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
        label="Birthday"
        name="doB"
        type="date"
        className={className}
      />
      <FormikTextInput
        label="Address"
        name="address"
        type="text"
        className={className}
      />
      <FormikSelect label="Gender" name="gender">
        <option selected value={Gender.Male}>
          Male
        </option>
        <option value={Gender.Female}>Female</option>
      </FormikSelect>
      <FormikTextInput
        label="Avatar"
        name="avatar"
        type="text"
        className={className}
      />

      <FormikTextInput
        label="Cover"
        name="cover"
        type="text"
        className={className}
      />
    </Form>
  );
};

export default CreateForm;

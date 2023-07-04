import { Form } from "formik";
import { FC } from "react";
import { FormikTextInput } from "../../commons/components";

const className =
  "bg-slate-50 dark:bg-slate-800 appearance-none border-b-1 border-gray-200 mb-3 w-full py-2 px-4 text-gray-500 leading-tight focus:outline-none focus:bg-slate-100 focus:border-indigo-500";

const UpdateForm: FC = () => {
  return (
    <Form>
      <FormikTextInput
        label="Name"
        name="name"
        type="text"
        className={className}
      />
      <FormikTextInput
        label="Description"
        name="description"
        type="text"
        className={className}
      />
      <FormikTextInput
        label="Coding languages"
        name="languages"
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

export default UpdateForm;

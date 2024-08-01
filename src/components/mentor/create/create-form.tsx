// src/components/mentor/create/creat-form.tsx
import { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input, Select } from "../../../commons/hook-form-component";
import * as Constants from "../../../commons/constants";
import { CreateFormType } from "./type";

const educationItems = [
  { name: "Bachelor", value: Constants.Education.Bachelor },
  { name: "College", value: Constants.Education.College },
];

const roleItems = [
  { name: "Mentor", value: Constants.Role.Mentor },
  { name: "Admin", value: Constants.Role.Admin },
];

type Props = {
  register: UseFormRegister<CreateFormType>;
  errors: FieldErrors<CreateFormType>;
};

const CreateForm: FC<Props> = ({ register, errors }) => {
  return (
    <>
      <Input
        label="Email"
        errors={errors}
        type="email"
        {...register("email")}
      />
      <Input label="Name" errors={errors} {...register("name")} />
      <Input
        label="Password"
        errors={errors}
        type="password"
        {...register("password")}
      />
      <Input
        label="Confirm Password"
        errors={errors}
        type="password"
        {...register("passwordConfirm")}
      />
      <Input
        label="Coding languages"
        errors={errors}
        {...register("languages")}
      />
      <Select
        label="Education"
        errors={errors}
        items={educationItems}
        {...register("education")}
      />
      <Input label="Specialized" errors={errors} {...register("specialized")} />
      <Input label="Avatar" errors={errors} {...register("avatar")} />
      <Select
        label="Role"
        errors={errors}
        items={roleItems}
        {...register("roles")}
      />
    </>
  );
};

export default CreateForm;

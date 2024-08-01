// src/components/mentor/update/update-form.tsx
import { FC } from "react";
import { Input, Select } from "../../../commons/hook-form-component";
import * as Constants from "../../../commons/constants";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UpdateFormType } from "./type";

const educationItems = [
  { name: "Bachelor", value: Constants.Education.Bachelor },
  { name: "College", value: Constants.Education.College },
];

const roleItems = [
  { name: "Mentor", value: Constants.Role.Mentor },
  { name: "Admin", value: Constants.Role.Admin },
];

const statusItems = [
  { name: "Active", value: Constants.Status.Active },
  { name: "Inactive", value: Constants.Status.Inactive },
];

type Props = {
  register: UseFormRegister<UpdateFormType>;
  errors: FieldErrors<UpdateFormType>;
};

const UpdateForm: FC<Props> = ({ register, errors }) => {
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
      <Select
        label="Role"
        errors={errors}
        items={roleItems}
        {...register("roles")}
      />
      <Select
        label="Status"
        errors={errors}
        items={statusItems}
        {...register("status")}
      />
    </>
  );
};

export default UpdateForm;

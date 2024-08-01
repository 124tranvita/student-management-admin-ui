import React, { useEffect, useState } from "react";
import CreateContainer from "../components/mentor/create/container";
// import { useEventManagement } from "../hooks/useEventManagement";
import { useEventManagement } from "../hooks/useEventManagement";
import Modal from "../commons/components/modal";
import CreateForm from "../components/mentor/create/create-form";
import { FormikContext, useFormik } from "formik";
import { mentorFormikInitial } from "../components/mentor/types";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../commons/hook-form-component/input";
import Select from "../commons/hook-form-component/select";
import { CreateFormType } from "../components/mentor/create/type";

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    role: yup.string().required("Role is required"),
  })
  .required();

enum EventId {
  init = "",
  create = "create",
  update = "update",
  read = "read",
  delete = "delete",
}

const Demo: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormType>({
    resolver: yupResolver(schema),
  });

  console.log("RENDER DEMO");

  const onSubmit = (data) => {
    console.log(data);
  };

  const items = [
    { name: "abc", value: 1 },
    { name: "abc1", value: 2 },
    { name: "abc2", value: 3 },
    { name: "abc3", value: 4 },
  ];
  // const { eventId, setEventId } = useEventManagement<EventId>(EventId.update);
  // const [isOpen, setIsOpen] = useState(false);
  // const { setEventId, getEventId } = useEventManagement<EventId>(
  //   EventId.delete
  // );

  // useEffect(() => {
  //   console.log("RENDER DEMO CONTAINER");
  // }, []);

  // console.log({ eventId: getEventId() });

  /** Formik bag */
  // const formikBag = useFormik({
  //   initialValues: mentorFormikInitial,
  //   validateOnBlur: false,
  //   // validationSchema: () => createValidationSchema(eventId),
  //   onSubmit: () => {},
  // });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CreateForm register={register} errors={errors} />
      <button type="submit">Submit</button>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" errors={errors} {...register("name")} />
        <Input label="Email" errors={errors} {...register("email")} />
        <Select
          label="Role"
          errors={errors}
          items={items}
          {...register("role")}
        />
        {/* <div>
          <label htmlFor="name">Name:</label>
          <input id="name" {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
        </div> */}

      {/* <div>
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div> */}
      {/* 
        <button type="submit">Submit</button>
      </form> */}
    </form>
    // <FormikContext.Provider value={formikBag}>
    //   <button onClick={() => setEventId(EventId.create)}>Create</button>
    //   <br />
    //   <button onClick={() => setEventId(EventId.update)}>Update</button>
    //   <br />
    //   <button onClick={() => setEventId(EventId.read)}>Read</button>
    //   <br />
    //   <button onClick={() => setEventId(EventId.delete)}>Delete</button>
    //   <br />
    //   <button onClick={() => setIsOpen(true)}>Modal</button>
    //   <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
    //     <CreateForm />
    //   </Modal>
    // </FormikContext.Provider>
  );
};

export default Demo;

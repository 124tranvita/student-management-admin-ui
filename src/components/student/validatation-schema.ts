import * as Yup from "yup";

export const createValidationSchema = () => {
  return Yup.object().shape({
    /** studentId */
    studentId: Yup.string()
      .min(3, `Id should be great than 3 characters.`)
      .max(7, `Id should be less than 24 character`)
      .required("Required"),
    /** name */
    name: Yup.string()
      .min(3, `Name should be great than 3 characters.`)
      .max(24, `Name should be less than 24 character`)
      .required("Required"),
    /** doB */
    doB: Yup.string().required("Required"),
    /** address */
    address: Yup.string().required("Required"),
  });
};

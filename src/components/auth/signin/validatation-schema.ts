import * as Yup from "yup";

export const createValidationSchema = () => {
  return Yup.object().shape({
    /** email */
    email: Yup.string().email().required("Required"),
    /** password */
    password: Yup.string().required("Required"),
  });
};

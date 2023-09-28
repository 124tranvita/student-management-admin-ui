import * as Yup from "yup";

export const createValidationSchema = () => {
  return Yup.object().shape({
    /** email */
    email: Yup.string().email("Invalid email address").required("Required"),
    /** password */
    password: Yup.string()
      .required("Required")
      .min(8, "Password must more than 8 characters"),
  });
};

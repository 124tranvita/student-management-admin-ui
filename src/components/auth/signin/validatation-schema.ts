import * as Yup from "yup";

export const validationSchema = Yup.object({
  /** email */
  email: Yup.string().email("Email invalid.").required("Required"),
  /** password */
  password: Yup.string()
    .min(8, "Password must more than 8 characters")
    .required("Password is required"),
}).required();

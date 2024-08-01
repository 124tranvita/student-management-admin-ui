import * as Yup from "yup";

export const validationSchema = Yup.object({
  /** email */
  email: Yup.string().email("Email invalid.").required("Required"),
  /** name */
  name: Yup.string()
    .min(3, `Name should be great than 3 characters.`)
    .max(12, `Name should be less than12 character`)
    .required("Required"),
  languages: Yup.string().required("Required"),
  /** education */
  education: Yup.string().required("Required"),
  /** specialized */
  specialized: Yup.string().required("Required"),
  /** avatar */
  avatar: Yup.string().required("Required"),
  /** role */
  roles: Yup.string().required("Required"),
  /** status */
  status: Yup.string().required("Required"),
}).required();

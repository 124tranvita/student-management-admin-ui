import * as Yup from "yup";

export const createValidationSchema = () => {
  return Yup.object().shape({
    /** name */
    name: Yup.string()
      .min(3, `Name should be great than 3 characters.`)
      .max(24, `Name should be less than 24 character`)
      .required("Required"),

    /** language */
    languages: Yup.string().required("Required"),
    cover: Yup.string().required("Required"),
  });
};

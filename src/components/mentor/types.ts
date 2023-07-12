export type MentorFormikProps = {
  id?: string;
  email: string;
  name: string;
  password?: string;
  passwordConfirm?: string;
  languages: string;
  education: string;
  specialized: string;
  avatar: string;
  roles: string;
  status: string;
};

export const mentorFormikInitial: MentorFormikProps = {
  id: "",
  email: "",
  name: "",
  password: "",
  passwordConfirm: "",
  languages: "",
  education: "1",
  specialized: "",
  avatar: "https://cdn-icons-png.flaticon.com/512/4128/4128405.png",
  roles: "mentor",
  status: "1",
};

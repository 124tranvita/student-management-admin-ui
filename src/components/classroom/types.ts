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
  avatar:
    "https://www.iconarchive.com/download/i106655/diversity-avatars/avatars/native-man.512.png",
  roles: "admin",
  status: "Active",
};

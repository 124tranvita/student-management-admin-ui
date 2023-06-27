export type StudentFormikProps = {
  id?: string;
  studentId: string;
  name: string;
  doB: string;
  address: string;
  gender: string;
  languages: string;
  status?: string;
  avatar: string;
  cover: string;
};

export const studentFormikInitial: StudentFormikProps = {
  id: "",
  studentId: "",
  name: "",
  doB: "",
  address: "",
  gender: "1",
  languages: "",
  status: "1",
  avatar: "https://cdn-icons-png.flaticon.com/512/4128/4128349.png",
  cover:
    "https://img.freepik.com/free-vector/flat-geometric-background_23-2148957201.jpg",
};

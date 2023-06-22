export type Mentor = {
  email: string;
  name: string;
  languages: string[];
  createdAt: string;
  status: string;
  avatar: string;
  roles: string;
  id: string;
  education: string;
  specialized: string;
};

export const mentorInitial: Mentor = {
  email: "",
  name: "",
  languages: [],
  createdAt: "",
  status: "Active",
  avatar: "",
  roles: "",
  id: "",
  education: "",
  specialized: "",
};

export type Class = {
  id: string;
  name: string;
  description?: string;
  languages: string[];
  createdAt: string;
  image: string;
  mentors?: Mentor[];
  students?: Student[];
};

export const classInitial: Class = {
  id: "",
  name: "",
  description: "",
  languages: [],
  createdAt: "",
  image: "",
  mentors: [],
  students: [],
};

export type Student = {
  studentId: string;
  name: string;
  doB: string;
  address: string;
  gender: string;
  languages: string[];
  status: string;
  avatar: string;
  classes: Class[];
  mentor: Mentor;
};

export const studentInitial: Student = {
  studentId: "",
  name: "",
  doB: "",
  address: "",
  gender: "",
  languages: [],
  status: "",
  avatar: "",
  classes: [],
  mentor: mentorInitial,
};

export type ClassroomCnt = {
  studentCnt: number;
  mentorCnt: number;
};

export type Response<T> = {
  status: string;
  data: T;
  result?: string;
  grossCnt?: number;
};

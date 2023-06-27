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

export type Classroom = {
  id: string;
  name: string;
  description?: string;
  languages: string[];
  createdAt: string;
  image: string;
  mentors?: Mentor[];
  students?: Student[];
};

export const classroomInitial: Classroom = {
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
  id: string;
  studentId: string;
  name: string;
  doB: string;
  address: string;
  gender: string;
  languages: string[];
  status: string;
  avatar: string;
  cover: string;
  classes: Classroom[];
  mentor: Mentor;
  createdAt: string;
};

export const studentInitial: Student = {
  id: "",
  studentId: "",
  name: "",
  doB: "",
  address: "",
  gender: "",
  languages: [],
  status: "",
  avatar: "",
  cover: "",
  classes: [],
  mentor: mentorInitial,
  createdAt: "",
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

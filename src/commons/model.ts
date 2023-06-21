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

export const mentoInitial: Mentor = {
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

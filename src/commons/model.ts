export type Response<T> = {
  status: string;
  data: T;
  grossCnt: number;
};

export const responseInitial: Response<object> = {
  status: "",
  data: {},
  grossCnt: 0,
};

export type Mentor = {
  _id: string;
  email: string;
  name: string;
  languages: string[];
  createdAt: string;
  status: string;
  avatar: string;
  roles: string;
  education: string;
  specialized: string;
  assignedStudent: number;
  assignedClassroom: number;
};

export const mentorInitial: Mentor = {
  _id: "",
  email: "",
  name: "",
  languages: [],
  createdAt: "",
  status: "Active",
  avatar: "",
  roles: "",
  education: "",
  specialized: "",
  assignedStudent: 0,
  assignedClassroom: 0,
};

export type Classroom = {
  _id: string;
  name: string;
  description?: string;
  languages: string[];
  createdAt: string;
  cover: string;
  mentors?: Mentor[];
  students?: Student[];
  assignedMentor: number;
  assignedStudent: number;
};

export const classroomInitial: Classroom = {
  _id: "",
  name: "",
  description: "",
  languages: [],
  createdAt: "",
  cover: "",
  mentors: [],
  students: [],
  assignedMentor: 0,
  assignedStudent: 0,
};

export type Student = {
  _id: string;
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
  isAssigned: string;
};

export const studentInitial: Student = {
  _id: "",
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
  isAssigned: "",
};

export type ClassroomCnt = {
  studentCnt: number;
  mentorCnt: number;
};

export type AssignStudentMentor = {
  id: string;
  assignedAt: string;
  studentId: string;
  studentName: string;
  studentStatus: string;
  studentAvatar: string;
  mentorName: string;
  mentor: Mentor;
  student: Student;
};

export const assignStudentMentorInitial: AssignStudentMentor = {
  id: "",
  assignedAt: "",
  studentId: "",
  studentName: "",
  studentStatus: "",
  studentAvatar: "",
  mentorName: "",
  mentor: mentorInitial,
  student: studentInitial,
};

export type AssignClassroomMentor = {
  _id: string;
  assignedAt: string;
  name: string;
  description?: string;
  languages: string[];
  cover: string;
  assignee: string;
  email?: string;
  status?: string;
  avatar?: string;
  mentor: Mentor;
  classroom: Classroom;
};

export const assignClassroomMentorInitial: AssignClassroomMentor = {
  _id: "",
  assignedAt: "",
  name: "",
  description: "",
  languages: [],
  cover: "",
  assignee: "",
  email: "",
  status: "",
  avatar: "",
  mentor: mentorInitial,
  classroom: classroomInitial,
};

export type SigninToken = {
  status: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export const signinTokenInitial: SigninToken = {
  status: "",
  data: {
    accessToken: "",
    refreshToken: "",
  },
};

export type Decoded = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

export type UserInf = {
  info: Decoded;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export const useInfInitial: UserInf = {
  info: {
    sub: "",
    email: "",
    iat: 0,
    exp: 0,
  },
  tokens: {
    accessToken: "",
    refreshToken: "",
  },
};

export type Error = {
  statusCode: number;
  status: string;
  timestamp: string;
  path: string;
  message: string;
};

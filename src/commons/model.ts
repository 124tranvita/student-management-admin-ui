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
  assginedMentor: number;
  assginedStudent: number;
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
  assginedMentor: 0,
  assginedStudent: 0,
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
  isAssigned: string;
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
  isAssigned: "",
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

export const assignStudentMentorInitial = {
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
  id: string;
  assignedAt: string;
  classroomName: string;
  classroomDesc: string;
  classroomLanguages: string[];
  classroomCover: string;
  mentorName: string;
  mentor: Mentor;
  classroom: Classroom;
};

export const assignClassroomMentorInitial = {
  id: "",
  assignedAt: "",
  classroomName: "",
  classroomDesc: "",
  classroomLanguages: [],
  classroomCover: "",
  mentorName: "",
  mentor: mentorInitial,
  classroom: classroomInitial,
};

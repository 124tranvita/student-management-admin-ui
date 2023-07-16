import Mentor from "../components/mentor";
import Student from "../components/student";
import Classroom from "../components/classroom";
import Dashboard from "../components/dashboard";
import { Signin } from "../components/auth";
import { ReactNode } from "react";

export type Pages = {
  page: ReactNode;
  path: string;
};

export const publicPages: Pages[] = [
  { page: <Signin />, path: "signin" },
  // { page: <Error />, path: "*" },
];

export const privatePages: Pages[] = [
  { page: <Dashboard />, path: "/" },
  { page: <Mentor />, path: "mentor" },
  { page: <Student />, path: "student" },
  { page: <Classroom />, path: "classroom" },
];

export type ClassroomFormikProps = {
  id?: string;
  name: string;
  description?: string;
  languages: string;
  cover: string;
};

export const classroomFormikInitial: ClassroomFormikProps = {
  id: "",
  name: "",
  description: "",
  languages: "",
  cover:
    "https://codequotient.com/blog/wp-content/uploads/2020/12/Are-All-Online-Coding-Classes-The-Same.jpg",
};

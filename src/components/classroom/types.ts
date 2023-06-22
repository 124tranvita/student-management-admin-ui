export type ClassroomFormikProps = {
  id?: string;
  name: string;
  description?: string;
  languages: string;
  image: string;
};

export const classroomFormikInitial: ClassroomFormikProps = {
  id: "",
  name: "",
  description: "",
  languages: "",
  image: "https://i.ytimg.com/vi/g1J4181W8ss/maxresdefault.jpg",
};

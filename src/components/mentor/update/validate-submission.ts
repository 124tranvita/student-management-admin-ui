import * as _ from "lodash";
import { Mentor } from "../../../commons/model";
// import { Status } from "../../../commons/constants";
import { UpdateFormType } from "./type";
// type Errors = UpdateFormType;
type Errors = {
  key: string;
  message: string;
};
const makeCompareObj = (value: UpdateFormType) => {
  return {
    name: value.name,
    languages: value.languages,
    status: value.status,
    avatar: value.avatar,
    roles: value.roles,
    specialized: value.specialized,
  } as UpdateFormType;
};

export const validateSubmission = (
  values: UpdateFormType,
  initValue?: Mentor
) => {
  // const errors = {} as Errors;
  const errors: Errors[] = [];

  if (initValue) {
    /** If mentor role have at least on assigned and change to admin role */
    // const isHasAssignedStudent = initValue && response.assignedStudent > 0;
    // const isHasAssignedClassroom = response && response.assignedClassroom > 0;

    // if (
    //   (isHasAssignedStudent && response.roles !== values.roles) ||
    //   (isHasAssignedClassroom && response.roles !== values.roles)
    // ) {
    //   errors["roles"] =
    //     "Please unassigned all students/classrooms when change to Admin role";
    // }

    // if (
    //   (isHasAssignedStudent && values.status !== Status.Active) ||
    //   (isHasAssignedClassroom && values.status !== Status.Active)
    // ) {
    //   errors["status"] =
    //     "Please unassigned all students/classrooms when change to Inactive";
    // }

    /** If there any change on update */
    const responseObj = makeCompareObj({
      ...initValue,
      languages: initValue.languages.toString(),
    });

    const inputObj = makeCompareObj(values);

    if (!_.isEqual(inputObj, responseObj)) {
      return errors;
    }

    for (const [key, value] of Object.entries(responseObj)) {
      if (_.isEqual(inputObj[key as keyof UpdateFormType], value)) {
        errors.push({ key: key, message: "Please use another value" });
      }
    }
  }

  return errors;
};

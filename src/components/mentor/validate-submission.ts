import * as _ from "lodash";
import { EventId } from "../../commons/constants";
import { Mentor } from "../../commons/model";
import { MentorFormikProps } from "./types";
import { Status } from "./constants";

type Errors = MentorFormikProps;
const makeCompareObj = (value: MentorFormikProps) => {
  return {
    name: value.name,
    languages: value.languages,
    status: value.status,
    avatar: value.avatar,
    roles: value.roles,
    specialized: value.specialized,
  } as MentorFormikProps;
};

export const createValidateSubmission = (
  values: MentorFormikProps,
  eventId: EventId,
  response?: Mentor
) => {
  const errors = {} as Errors;

  if (response && eventId === EventId.Update) {
    /** If mentor role have at least on assigned and change to admin role */
    const isHasAssignedStudent = response && response.assignedStudent > 0;
    const isHasAssignedClassroom = response && response.assignedClassroom > 0;

    if (
      (isHasAssignedStudent && response.roles !== values.roles) ||
      (isHasAssignedClassroom && response.roles !== values.roles)
    ) {
      errors["roles"] =
        "Please unassigned all students/classrooms when change to Admin role";
    }

    if (
      (isHasAssignedStudent && values.status !== Status.Active) ||
      (isHasAssignedClassroom && values.status !== Status.Active)
    ) {
      errors["status"] =
        "Please unassigned all students/classrooms when change to Inactive";
    }

    /** If there any change on update */
    const responseObj = makeCompareObj({
      ...response,
      languages: response.languages.toString(),
    });

    const inputObj = makeCompareObj(values);

    if (!_.isEqual(inputObj, responseObj)) {
      return errors;
    }

    for (const [key, value] of Object.entries(responseObj)) {
      if (_.isEqual(inputObj[key as keyof MentorFormikProps], value)) {
        errors[key as keyof Errors] = "Please use another value";
      }
    }
  }

  console.log({ response });

  return errors;
};

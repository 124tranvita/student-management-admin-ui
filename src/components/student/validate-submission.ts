import * as _ from "lodash";
import { EventId } from "../../commons/constants";
import { Student } from "../../commons/model";
import { dateFormatter } from "../../commons/time-func";
import { StudentFormikProps } from "./types";

type Errors = StudentFormikProps;
const makeCompareObj = (value: StudentFormikProps) => {
  return {
    studentId: value.studentId,
    name: value.name,
    doB: dateFormatter(value.doB, "yyyy-MM-dd"),
    address: value.address,
    gender: value.gender,
    languages: value.languages,
    status: value.status,
    avatar: value.avatar,
    cover: value.cover,
  } as StudentFormikProps;
};

export const createValidateSubmission = (
  values: StudentFormikProps,
  eventId: EventId,
  response?: Student
) => {
  const errors = {} as Errors;

  if (response && eventId === EventId.Update) {
    const responseObj = makeCompareObj({
      ...response,
      languages: response.languages.toString(),
    });

    const inputObj = makeCompareObj(values);

    if (!_.isEqual(inputObj, responseObj)) {
      return errors;
    }

    for (const [key, value] of Object.entries(responseObj)) {
      if (_.isEqual(inputObj[key as keyof StudentFormikProps], value)) {
        errors[key as keyof Errors] = "Please use another value";
      }
    }
  }

  return errors;
};

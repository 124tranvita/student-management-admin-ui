import * as _ from "lodash";
import { EventId } from "../../commons/constants";
import { Class } from "../../commons/model";
import { ClassroomFormikProps } from "./types";

type Errors = ClassroomFormikProps;
const makeCompareObj = (value: ClassroomFormikProps) => {
  return {
    name: value.name,
    description: value.description,
    languages: value.languages,
    image: value.image,
  } as ClassroomFormikProps;
};

export const createValidateSubmission = (
  values: ClassroomFormikProps,
  eventId: EventId,
  response?: Class
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
      if (_.isEqual(inputObj[key as keyof ClassroomFormikProps], value)) {
        errors[key as keyof Errors] = "Please use another value";
      }
    }
  }

  return errors;
};

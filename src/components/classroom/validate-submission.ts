import * as _ from "lodash";
import { EventId } from "../../commons/constants";
import { Mentor } from "../../commons/model";
import { MentorFormikProps } from "./types";

type Errors = {
  email: string;
  name: string;
  languages: string;
  status: string;
  avatar: string;
  roles: string;
  education: string;
  specialized: string;
};
const makeCompareObj = (value: Errors) => {
  return {
    email: value.email,
    name: value.name,
    languages: value.languages,
    status: value.status,
    avatar: value.avatar,
    roles: value.roles,
    specialized: value.specialized,
  } as Errors;
};

export const createValidateSubmission = (
  values: MentorFormikProps,
  eventId: EventId,
  response?: Mentor
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
      if (_.isEqual(inputObj[key as keyof Errors], value)) {
        errors[key as keyof Errors] = "Please use another value";
      }
    }
  }

  return errors;
};

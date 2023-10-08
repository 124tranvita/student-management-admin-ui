import * as _ from "lodash";
import { Error, Response, SerializedTypeExtends } from "./model";
import { EventId, HttpStatusCode, ResponseResult } from "./constants";

export const classNames = (
  ...classes: (false | null | undefined | string)[]
) => {
  return classes.filter(Boolean).join(" ");
};

export const compareObjectId = (id1: string, id2: string) => {
  // return id1.toString() === id2.toString();
  return _.isEqual(id1, id2);
};

export const isResponseSuccessfully = <T>(response: Response<T>) => {
  return _.isEqual(response.status, ResponseResult.success);
};

export const isHttpStatusCode401 = (error: Error) => {
  return _.isEqual(error.statusCode, HttpStatusCode.code401);
};

export const isNotNullData = <T>(data: T) => {
  return !_.isEmpty(data);
};

export const capitalize = (value: string) => {
  if (!value) return "";

  const firstChar = value.slice(0, 1);

  return firstChar.toUpperCase() + value.slice(1);
};

export const getEduction = (value: string) => {
  if (value !== "0" && value !== "1") return "Unknown";
  return value === "1" ? "Bachelor" : "College";
};

export const getGender = (value: string) => {
  if (value !== "0" && value !== "1") return "Unknown";
  return value === "1" ? "Male" : "Female";
};

export const getStatus = (value: string) => {
  if (value !== "0" && value !== "1" && value !== "2") return "Unknown";
  return value === "1" ? "Active" : value === "0" ? "Inactive" : "Busy";
};

export const getMentorFilter = (value: string): string => {
  return value === "0" ? "Mentor" : "Admin";
};

type Ids = {
  _id: string;
};

export const getUnassignArrayDiff = <T extends Ids>(
  array1: T[],
  array2: T[]
) => {
  return array1.filter(
    (object1) => !array2.some((object2) => object1._id === object2._id)
  );
};

export const getAssignArrayDiff = <
  T extends Ids,
  K extends SerializedTypeExtends
>(
  records: T[],
  response: K[],
  key: string
) => {
  return records.filter((object1) =>
    response.every((object2) => object1._id !== object2[key as keyof K])
  );
};

export const serializedAssignResponseArray = <
  T extends Ids,
  K extends SerializedTypeExtends
>(
  records: T[],
  response: K[],
  key: string
) => {
  const serialized = getAssignArrayDiff<T, K>(records, response, key);

  return serialized;
};

export const serializedPatchResponse = <T extends Ids>(
  records: T[],
  response: T
) => {
  const serialized = records.map((item: T) => {
    if (item._id === response._id) {
      item = response;
    }
    return item;
  });

  return serialized;
};

export const serializedDeleteResponse = <T extends Ids>(
  records: T[],
  response: T
) => {
  const serialized = records.filter((item: T) => item._id !== response._id);

  return serialized;
};

export const serializedUnassignResponseArray = <T extends Ids>(
  records: T[],
  response: T[]
) => {
  const serialized = getUnassignArrayDiff(records, response);

  return serialized;
};

export const getToastMsg = (prefix: string, eventId: EventId) => {
  switch (eventId) {
    case EventId.Add:
      return `New ${prefix} has been added`;
    case EventId.Update:
      return `Selected ${prefix} has been updated`;
    case EventId.Delete:
      return `Selected ${prefix} has been deleted`;
    case EventId.Assign:
      return `Selected ${prefix} has been assigned`;
    case EventId.Unassign:
      return `Selected ${prefix} has been unassigned`;
    default:
      return "";
  }
};

export const storeHistory = (path: string) => {
  if (!path) return "";
  localStorage.setItem("path", path);
};

export const getStoreHistory = () => {
  const history = localStorage.getItem("path");

  return history ? history : "";
};

export const checkIsComponentLoading = (
  eventId: EventId,
  isLoading: boolean
) => {
  return (
    isLoading &&
    (eventId === EventId.Add ||
      eventId === EventId.Update ||
      eventId === EventId.Delete ||
      eventId === EventId.Paging ||
      eventId === EventId.Search)
  );
};

type DestObj = {
  name: string;
  to: string;
  destiny: boolean;
};

export const analystPath = (path?: string): DestObj[] => {
  if (!path) return [];

  const destObj: DestObj[] = [];
  const des = path.split("/");

  if (des && des.length === 1) {
    const obj = {
      name: capitalize(des[0]),
      to: des[0],
      destiny: true,
    };

    destObj.push(obj);
  }

  if (des && des.length > 1) {
    des.forEach((item, index) => {
      const obj = {
        name: capitalize(item),
        to: item,
        destiny: index === des.length - 1 ? true : false,
      };

      destObj.push(obj);
    });
  }

  return destObj;
};

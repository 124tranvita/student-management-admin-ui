import * as _ from "lodash";
import { Error, Response } from "./model";
import { HttpStatusCode, ResponseResult } from "./constants";

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

export const getArrayDiff = (array1: any[], array2: any[]) => {
  return array1.filter(
    (object1) => !array2.some((object2) => object1._id === object2._id)
  );
};

export const getMentorFilter = (value: string): string => {
  return value === "0" ? "Mentor" : "Admin";
};

export const getAssignArrayDiff = (
  array1: any[],
  array2: any[],
  model: string
) => {
  return array1.filter(
    (object1) => !array2.some((object2) => object1._id === object2[model])
  );
};

export const serializedPatchResponse = <T>(
  data: any | T[],
  result: any | T
) => {
  const serialized = data.map((item: any | T) => {
    if (item._id === result._id) {
      item = result;
    }
    return item;
  });

  return serialized;
};

export const serializedDeleteResponse = <T>(
  data: any | T[],
  result: any | T
) => {
  const serialized = data.filter((item: any | T) => item._id !== result._id);

  return serialized;
};

export const serializedDeleteResponseArray = <T>(
  data: any[] | T[],
  result: any[] | T[]
) => {
  const serialized = getArrayDiff(data, result);

  return serialized;
};

export const serializedAssignResponseArray = <T>(
  data: any[] | T[],
  result: any[] | T[],
  model: string
) => {
  const serialized = getAssignArrayDiff(data, result, model);

  return serialized;
};

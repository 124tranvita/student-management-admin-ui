import { Response } from "./model";

export const classNames = (
  ...classes: (false | null | undefined | string)[]
) => {
  return classes.filter(Boolean).join(" ");
};

export const compareObjectId = (id1: string, id2: string) => {
  return id1.toString() === id2.toString();
};

export const isResponseSuccessfully = <T>(response: Response<T>) => {
  return response.status === "success";
};

export const isNotNullData = <T>(data: T) => {
  return JSON.stringify(data) !== "{}";
};

export const capitalize = (value: string) => {
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

export const serializedPatchResponse = <T>(
  data: any | T[],
  result: any | T
) => {
  const serialized = data.map((item: any | T) => {
    if (item.id === result.id) {
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
  const serialized = data.filter((item: any | T) => item.id !== result.id);

  return serialized;
};

export enum EventId {
  Init = "initial",
  Add = "add",
  Delete = "delete",
  Update = "update",
  Paging = "paging",
  Assign = "assign",
  Unassign = "unassign",
  RenewToken = "renewToken",
  Filter = "filter",
  Search = "search",
  None = "",
}

export const PAGE_LIMIT = 10;

export enum ResponseResult {
  success = "success",
  failed = "failed",
  error = "error",
}

export enum HttpStatusCode {
  code401 = 401,
  code404 = 404,
}

export enum ErrorStatus {
  Error = "error",
  Warning = "warning",
  Success = "success",
}

export const MAX_ASSIGNED_CLASSROOM = 5;
export const MAX_ASSIGNED_STUDENT = 25;

export const TOKEN_EXPIRY = 900000;

export enum Role {
  Admin = "admin",
  Mentor = "mentor",
}

export enum Education {
  Bachelor = "1",
  College = "0",
}

export enum Status {
  Active = "1",
  Inactive = "0",
}

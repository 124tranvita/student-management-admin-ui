export enum EventId {
  Init = "initial",
  Add = "add",
  Delete = "delete",
  Update = "update",
  Paging = "paging",
  Assign = "assign",
  Unassign = "unassign",
  RenewToken = "renewToken",
  Search = "search",
  None = "",
}

export const PAGE_LIMIT = 10;
export const PAGE_MAX = 999;

export enum ResponseResult {
  success = "success",
  failed = "failed",
  error = "error",
}

export enum HttpStatusCode {
  code401 = 401,
  code404 = 404,
}

export enum Status {
  Error = "error",
  Warning = "warning",
  Success = "success",
  None = "",
}

export enum Prefix {
  Mentor = "mentor",
  Classroom = "classroom",
  Student = "student",
}

export enum Method {
  Get = "GET",
  Post = "POST",
  Patch = "PATCH",
  Delete = "DELETE",
}

export const MAX_ASSIGNED_CLASSROOM = 5;
export const MAX_ASSIGNED_STUDENT = 25;

export const TOKEN_EXPIRY = 900000;
// export const TOKEN_EXPIRY = 180000;

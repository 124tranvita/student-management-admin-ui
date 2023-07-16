export enum EventId {
  Init = "initial",
  Add = "add",
  Delete = "delete",
  Update = "update",
  Paging = "paging",
  Assign = "assign",
  Unassign = "unassign",
  RenewToken = "renewToken",
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

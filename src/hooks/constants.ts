/** AuthContext */
export const ACT_API_REQUEST = "act_api_request" as const;
export const ACT_API_SUCCESS = "act_api_success" as const;
export const ACT_API_FAILURE = "act_api_failure" as const;

export type Types =
  | typeof ACT_API_REQUEST
  | typeof ACT_API_SUCCESS
  | typeof ACT_API_FAILURE;

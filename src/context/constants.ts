/** AuthContext */
export const ACT_USER_LOGIN = "act_user_login" as const;
export const ACT_USER_LOGOUT = "act_user_logout" as const;

/** UserContext */
export const ACT_SET_USER = "act_set_user" as const;
export const ACT_UNSET_USER = "act_unset_user" as const;

export type Types =
  | typeof ACT_USER_LOGIN
  | typeof ACT_USER_LOGOUT
  | typeof ACT_SET_USER
  | typeof ACT_UNSET_USER;

/** AuthContext */
export const ACT_USER_LOGIN = "act_user_login" as const;
export const ACT_USER_LOGOUT = "act_user_logout" as const;

/** LoginInfContext */
export const ACT_SET_LOGIN_INF = "act_set_login_inf" as const;
export const ACT_UNSET_LOGIN_INF = "act_unset_login_inf" as const;

export type Types =
  | typeof ACT_USER_LOGIN
  | typeof ACT_USER_LOGOUT
  | typeof ACT_SET_LOGIN_INF
  | typeof ACT_UNSET_LOGIN_INF;

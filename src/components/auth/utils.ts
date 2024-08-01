// import jwt_decode from "jwt-decode";
// import { LoginInf, SigninToken, useInfInitial } from "../../commons/model";
// import * as Constants from "../../context/constants";

// type LoginInfActionType = {
//   type: Constants.Types;
//   payload: LoginInf;
// };

// type AuthActionType = {
//   type: Constants.Types;
//   payload: SigninToken;
// };

// export const getProfile = (
//   accessToken: string,
//   dispatch: React.Dispatch<LoginInfActionType>
// ) => {
//   const decoded: LoginInf = jwt_decode(accessToken);
//   sessionStorage.setItem("loginInf", JSON.stringify(decoded));
//   dispatch({ type: Constants.ACT_SET_LOGIN_INF, payload: decoded });
// };

// export const authenitcated = (
//   signinToken: SigninToken,
//   dispatch: React.Dispatch<AuthActionType>
// ) => {
//   // Store refresh token to session storage
//   sessionStorage.setItem(
//     "refreshToken",
//     JSON.stringify(signinToken.refreshToken)
//   );
//   // Store access token to session storage
//   sessionStorage.setItem(
//     "accessToken",
//     JSON.stringify(signinToken.accessToken)
//   );
//   // Set signin token to auth context
//   dispatch({ type: Constants.ACT_USER_LOGIN, payload: signinToken });
// };

// export const refreshToken = async (
//   token: string
// ): Promise<SigninToken | undefined> => {
//   try {
//     const URL = `${import.meta.env.VITE_API_BASE_URL_LOCAL}auth/refresh`;

//     const response = await fetch(URL, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       console.log(error);
//     }

//     const { accessToken, refreshToken } = await response.json();

//     return { accessToken, refreshToken };
//   } catch (error) {
//     console.log({ error });
//   }
// };

// export const sendRefreshToken = async (
//   dispatch: React.Dispatch<AuthActionType>
// ) => {
//   const rfsToken = JSON.parse(sessionStorage.getItem("refreshToken") || "");

//   try {
//     if (rfsToken) {
//       const result = await refreshToken(rfsToken);
//       if (!result) {
//         return;
//       }

//       authenitcated(result, dispatch);
//     }
//   } catch (error) {
//     console.log({ error });
//   }
// };

// export const logout = (dispatch: React.Dispatch<AuthActionType>) => {
//   dispatch({
//     type: Constants.ACT_USER_LOGIN,
//     payload: useInfInitial,
//   });
//   localStorage.clear();
//   sessionStorage.clear();
// };

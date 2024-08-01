import { useCallback } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
// import { LoginInfContextProvider } from "./context/LoginInfContext";
import { useAuthContext } from "./hooks/useAuthContext";
import { publicPages, privatePages, Pages } from "./pages";
import { Wrapper } from "./commons/components";
// import { logout } from "./components/auth/utils";
// import { useSilentRefreshToken } from "./hooks/useSilentRefreshToken";
import { getStoreHistory } from "./commons/utils";
// import { TOKEN_EXPIRY } from "./commons/constants";
import * as Constants from "./context/constants";
import { useInfInitial } from "./commons/model";
import { EventManagementProvider } from "./context/EventManagementContext";

function App() {
  const history = getStoreHistory();
  const navigate = useNavigate();
  const { userInfo, dispatchAuth } = useAuthContext();
  // const { clearRefInterval } = useSilentRefreshToken(
  //   signinToken.refreshToken,
  //   TOKEN_EXPIRY,
  //   dispatchAuth
  // );

  const handleSignOut = useCallback(async () => {
    // clearRefInterval();
    dispatchAuth({
      type: Constants.ACT_USER_LOGIN,
      payload: useInfInitial,
    });
    localStorage.clear();
    sessionStorage.clear();
    return navigate("/signin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* <LoginInfContextProvider> */}
      <EventManagementProvider>
        <Routes>
          {publicPages.map((page: Pages, index: number) => (
            <Route
              key={index}
              path={page.path}
              element={
                !userInfo.tokens.accessToken ? (
                  <>{page.page}</>
                ) : (
                  <Navigate to={history} />
                )
              }
            />
          ))}

          {privatePages.map((page, index: number) => (
            <Route
              key={index}
              path={page.path}
              element={
                userInfo.tokens.accessToken ? (
                  <Wrapper onClick={handleSignOut}>{page.page}</Wrapper>
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
          ))}
        </Routes>
      </EventManagementProvider>
      {/* </LoginInfContextProvider> */}
    </div>
  );
}

export default App;

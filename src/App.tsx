import { useCallback } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { LoginInfContextProvider } from "./context/LoginInfContext";
import { useAuthContext } from "./hooks/useAuthContext";
import { publicPages, privatePages, Pages } from "./pages";
import { Wrapper } from "./commons/components";
import { logout } from "./components/auth/utils";
import { useSilentRefreshToken } from "./hooks/useSilentRefreshToken";
import { getStoreHistory } from "./commons/utils";
import { TOKEN_EXPIRY } from "./commons/constants";

function App() {
  const history = getStoreHistory();
  const navigate = useNavigate();
  const { signinToken, dispatchAuth } = useAuthContext();
  const { clearRefInterval } = useSilentRefreshToken(
    signinToken.refreshToken,
    TOKEN_EXPIRY,
    dispatchAuth
  );

  const handleSignOut = useCallback(async () => {
    clearRefInterval();
    logout(dispatchAuth);
    return navigate("/sign-in");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <LoginInfContextProvider>
        <Routes>
          {publicPages.map((page: Pages, index: number) => (
            <Route
              key={index}
              path={page.path}
              element={
                !signinToken.accessToken ? (
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
                signinToken.accessToken ? (
                  <Wrapper onClick={handleSignOut}>{page.page}</Wrapper>
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />
          ))}
        </Routes>
      </LoginInfContextProvider>
    </div>
  );
}

export default App;

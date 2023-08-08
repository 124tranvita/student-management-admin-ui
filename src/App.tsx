import { Navigate, Route, Routes } from "react-router-dom";
import { LoginInfContextProvider } from "./context/LoginInfContext";
import { useAuthContext } from "./hooks/useAuthContext";
import { publicPages, privatePages, Pages } from "./pages";

function App() {
  const { signinToken } = useAuthContext();

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
                  <Navigate to="/mentor" />
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
                  <>{page.page}</>
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

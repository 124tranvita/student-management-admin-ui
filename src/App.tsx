import { Route, Routes } from "react-router-dom";
import { Classroom, Mentor, Student, Signin, Page } from "./pages";
import { AuthContextProvider } from "./context/AuthContext";
import { UserContextProvider } from "./context/UserContext";

function App() {
  return (
    <div>
      <AuthContextProvider>
        <UserContextProvider>
          <Routes>
            <Route path="/" element={<Page />} />
            <Route path="/mentor" element={<Mentor />} />
            <Route path="/classroom" element={<Classroom />} />
            <Route path="/student" element={<Student />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>
        </UserContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default App;

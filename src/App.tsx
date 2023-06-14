import { Route, Routes } from "react-router-dom";
import { Classroom, Mentor, Student } from "./pages";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/classroom" element={<Classroom />} />
        <Route path="/student" element={<Student />} />
      </Routes>
    </div>
  );
}

export default App;

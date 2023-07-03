import { Route, Routes } from "react-router-dom";
import { Classroom, Mentor, Student, Assign, Page } from "./pages";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/classroom" element={<Classroom />} />
        <Route path="/student" element={<Student />} />
        <Route path="/assign/:id" element={<Assign />} />
      </Routes>
    </div>
  );
}

export default App;

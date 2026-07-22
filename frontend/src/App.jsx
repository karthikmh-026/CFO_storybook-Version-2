import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Storybook from "./Storybook";
import ViolationDetail from "./pages/ViolationDetail";
import DeepDive from "./pages/DeepDive";
import RequireAuth from "./components/RequireAuth";
import "./styles/theme.css";
import "./styles/chapters.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/storybook"
          element={
            <RequireAuth>
              <Storybook />
            </RequireAuth>
          }
        />
        <Route
          path="/violation/:id"
          element={
            <RequireAuth>
              <ViolationDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/deepdive/:chapter"
          element={
            <RequireAuth>
              <DeepDive />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

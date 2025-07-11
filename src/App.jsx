import { useState } from "react";
import "./App.css";
import Scene from "./Scene";
import Login from "./Components/Login/Login";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminManagement from "./Components/Admin/AdminManagment";

function App() {
  const [objects, setObjects] = useState([
    { path: "/old_sofa.glb", name: "sofa", scale: 0.03 },
    { path: "/old_sofa.glb", name: "sofa2", scale: 0.03 },
    { path: "/table.glb", name: "table", scale: 0.001 },
  ]);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !userRole ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to={userRole === "admin" ? "/admin" : "/scene"} />
            )
          }
        />
        <Route
          path="/admin"
          element={
            userRole === "admin" ? (
              <AdminManagement setUserRole={setUserRole} />
            ) : (
              <Navigate to="/scene" />
            )
          }
        />
        <Route
          path="/scene"
          element={
            userRole ? <Scene objects={objects} /> : <Navigate to="/" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
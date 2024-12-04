import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import Tasks from "./Tasks";

const App = () => {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tasks" element={<Tasks />} />
    </Routes>
  );
};

export default App;

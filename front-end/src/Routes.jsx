import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PaginaLogin from "./pages/Login";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Menu";
import Grid from "./pages/Grid";

const useAuthentication = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, []);

  return authenticated;
};

const useAdmin = () => {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role === "admin") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, []);

  return admin;
};

export default function AppRoutes() {
  const isAuthenticated = useAuthentication();
  const isAdmin = useAdmin();

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", function () {
      sessionStorage.clear();
    });
  }, []);

  const pathParts = window.location.pathname.split('/');
  const dynamicPath = pathParts[pathParts.length - 1];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaLogin />} />
        <Route path="/grid" element={<Grid />} />
        <Route path={`/auth/register/${dynamicPath}`} element={<Registration />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated && isAdmin ? (
              <Dashboard />
            ) : isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

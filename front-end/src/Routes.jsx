import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PaginaLogin from "./pages/Login";
import Dashboard from "./pages/Menu";
import Registration from "./pages/Registration";

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

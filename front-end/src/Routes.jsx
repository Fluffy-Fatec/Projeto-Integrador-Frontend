import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PaginaLogin from "./pages/Login";
import Dashboard from "./pages/Menu";
import PaginaRegistration from "./pages/Registration";
import GridDashboard from "./components/GridDashboard";
import Cookies from 'js-cookie';

const useAuthentication = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
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
    const role = Cookies.get("role");
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

  const pathParts = window.location.pathname.split('/');
  const dynamicPath = pathParts[pathParts.length - 1];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaLogin />} />
        <Route path="/grid" element={<GridDashboard />} />
        <Route path={`/auth/register/${dynamicPath}`} element={<PaginaRegistration />} />
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

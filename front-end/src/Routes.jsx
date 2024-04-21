import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PaginaLogin from "./pages/Login";
import Dashboard from "./pages/Menu";
import PaginaRegistration from "./pages/Registration";
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
  const [inactiveTimer, setInactiveTimer] = useState(null);
  const resetInactiveTimer = () => {
    if (inactiveTimer) {
      clearTimeout(inactiveTimer);
    }
    const timer = setTimeout(() => {
      localStorage.removeItem('accessToken');
      localStorage.setItem('inactiveRedirect', 'true');
      window.location.href = '/';
    }, 60000); 
  
    setInactiveTimer(timer);
  };

  useEffect(() => {
    const redirectFlag = localStorage.getItem('inactiveRedirect');
    if (redirectFlag === 'true') {
      alert('Oops! It looks like you\'ve been inactive for a while. For security purposes, you\'ve been redirected to the login screen.');
      localStorage.removeItem('inactiveRedirect');
    }
  }, []);


  useEffect(() => {
    const handleUserActivity = () => {
      resetInactiveTimer();
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);

    resetInactiveTimer();

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
    };
  }, []);

  const pathParts = window.location.pathname.split('/');
  const dynamicPath = pathParts[pathParts.length - 1];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaLogin />} />
        <Route path={`/auth/register/${dynamicPath}`} element={<PaginaRegistration />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
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

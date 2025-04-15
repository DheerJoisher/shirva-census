import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminRouteGuard = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const password = prompt("Enter admin password:");
    console.log(import.meta.env.VITE_REACT_APP_ADMIN_PASSWORD , password)
    if (password === import.meta.env.VITE_REACT_APP_ADMIN_PASSWORD) {
      console.log("Access granted to admin routes.");
      setAuthorized(true);
    } else {
      console.warn("Access denied: incorrect password.");
    }

    setChecked(true);
  }, []);

  if (!checked) return null;

  return authorized ? children : <Navigate to="/" />;
};

export default AdminRouteGuard;

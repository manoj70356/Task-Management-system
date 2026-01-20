// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, render children (Dashboard)
  return children;
}

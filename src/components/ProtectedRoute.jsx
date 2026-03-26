import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute
 * Wraps any page that requires the user to be logged in.
 * If no user found in localStorage → redirect to /login.
 * Also handles corrupted/invalid JSON in localStorage gracefully.
 */
const ProtectedRoute = ({ children }) => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return <Navigate to="/login" replace />;

    const user = JSON.parse(raw);
    if (!user || !user._id) return <Navigate to="/login" replace />;

    return children;
  } catch {
    // Corrupted localStorage — clear and redirect
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

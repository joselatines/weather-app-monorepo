import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const validToken = token && token.length > 0 && token !== "undefined";
  const logOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  }
  // If token exists, render the child routes (using Outlet)
  // Otherwise, redirect to the login page
  return validToken ? <><button onClick={logOut}> Log out</button> <Outlet /></>  : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

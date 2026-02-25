import { Navigate } from "react-router-dom";
import { getToken } from "../utils/token";

export default function PrivateRoute({ children, role }: any) {
  const token = getToken();

  // if (loading) {
  //   return <div>Carregando...</div>;
  // }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  // if (role && auth?.role !== role) {
  //   return <Navigate to="/login" />;
  // }
  return children;
}

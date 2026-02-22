import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }: any) {
  const getUserData = localStorage.getItem("USER_TOKEN");
  const parsedUserData = JSON.parse(getUserData!);

  // if (loading) {
  //   return <div>Carregando...</div>;
  // }

  if (!parsedUserData.accessToken) {
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

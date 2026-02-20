import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children, role }: any) {
  // const auth = JSON.parse(localStorage.getItem("auth") || "null");
  // const isAuthenticated = !!auth;
  const { user, loading }: any = useAuth();
  console.log({user});
  
  // if (loading) {
  //   return <div>Carregando...</div>;
  // }

  if (!user) {
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

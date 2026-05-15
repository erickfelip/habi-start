import "./App.css";
import { Login } from "../src/pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../src/routes/router";
import { Admin } from "./pages/Admin";
// import { Coordenador } from "./pages/Coordenador";
import { Home } from "./pages/Home";
import { Municipios } from "./pages/Municipios";
import { CadastroUsuarios } from "./pages/CadastroUsuarios";
import { Empreendimentos } from "./pages/Empreedimentos";
import { Hierarquizacao } from "./pages/Hierarquizacao";
import { CadastroBeneficiario } from "./pages/CadastroBeneficiarios";
import { getUserData } from "./services/sga.requests";
import { useQuery } from "@tanstack/react-query";

export const App = () => {
  // validar role do usuario para direcionar as rotas

  const { data: userLoggedData, isLoading: _isLoading } = useQuery({
    queryKey: ["GET_USERDATA"],
    queryFn: async () => {
      const response = await getUserData();
      return response;
    },
    retry: true,
    refetchOnWindowFocus: true,
  });

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Rota privada */}

      <Route
        path="/home"
        element={
          <PrivateRoute role="admin">
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <Admin />
          </PrivateRoute>
        }
      />

      {/* <Route
        path="/coordenador"
        element={
          <PrivateRoute role="coordenador">
            <Coordenador />
          </PrivateRoute>
        }
      /> */}

      {userLoggedData!?.cargo === "ADMIN" && (
        <Route
          path="/municipios"
          element={
            <PrivateRoute>
              <Municipios />
            </PrivateRoute>
          }
        />
      )}

      <Route
        path="/empreendimentos"
        element={
          <PrivateRoute>
            <Empreendimentos />
          </PrivateRoute>
        }
      />

      <Route
        path="/beneficiarios"
        element={
          <PrivateRoute>
            <CadastroBeneficiario />
          </PrivateRoute>
        }
      />

      <Route
        path="/hierarquizacao"
        element={
          <PrivateRoute>
            <Hierarquizacao />
          </PrivateRoute>
        }
      />

      <Route
        path="/usuarios"
        element={
          <PrivateRoute>
            <CadastroUsuarios />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

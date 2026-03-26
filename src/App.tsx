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
import { Sorteio } from "./pages/Sorteio";

export const App = () => {
  // validar role do usuario para direcionar as rotas
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

      <Route
        path="/municipios"
        element={
          <PrivateRoute>
            <Municipios />
          </PrivateRoute>
        }
      />

      <Route
        path="/empreendimentos"
        element={
          <PrivateRoute>
            <Empreendimentos />
          </PrivateRoute>
        }
      />

      <Route
        path="/sorteio"
        element={
          <PrivateRoute>
            <Sorteio />
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

import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };
  return (
    <div>
      <>
        <div>Área Administrativa START</div>
        <span>
          Você está em uma rota privada renderizando um componente específico de
          admin.
        </span>
        <Button danger onClick={logout}>
          Sair
        </Button>
      </>
    </div>
  );
};

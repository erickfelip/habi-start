import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

export const Coordenador = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: 32, background: "white" }}>
      <Title>Área Coordenação SG</Title>
      <Paragraph>
        Você está em uma rota privada renderizando um componente específico de
        admin.
      </Paragraph>
      <Button danger onClick={logout}>
        Sair
      </Button>
    </div>
  );
};

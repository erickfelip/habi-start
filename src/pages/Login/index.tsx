import { HabImage, StartLogo } from "./styles";
import img from "../../assets/img.jpg";
import start from "../../assets/start.png";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const { login }: any = useAuth();

  const onFinish = async (values: any) => {
    // Mock de autenticação
    // if (values.username && values.password) {
    //   const role =
    //     values.username.toLowerCase() === "admin" ? "admin" : "coordenador";
    //   localStorage.setItem("auth", JSON.stringify({ role }));
    //   navigate(role === "admin" ? "/admin" : "/coordenador");
    // }

    try {
      await login(values.username, values.password);
      navigate("/home");
    } catch (err) {
      // setError(err.response?.data?.message || "Erro ao fazer login");
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        background: "grey",
        width: "100vw",
        height: "100dvh",
      }}
    >
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <HabImage src={img} />
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          background: "white",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "80%",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <StartLogo src={start} />

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Usuário:"
              name="username"
              rules={[{ required: true, message: "Usuário é obrigatório" }]}
            >
              <Input
                size="large"
                placeholder="Nome de usuário"
                type={"email"}
              />
            </Form.Item>
            <Form.Item
              label="Senha:"
              name="password"
              rules={[{ required: true, message: "Senha é obrigatória" }]}
            >
              <Input.Password size="large" placeholder="Senha" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{ marginTop: "20px", backgroundColor: "#F07620" }}
            >
              Entrar
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

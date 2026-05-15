import { MenuOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  Nav,
  RouteLabel,
  NavLinks,
  LastElement,
  StartLogo,
  NavDrawer,
  RouteLabelDrawer,
} from "./styles";
import start from "../../assets/start.png";
import { useLocation, useNavigate } from "react-router-dom";
import { Drawer } from "antd";
import { getUserData } from "../../services/sga.requests";
import { useQuery } from "@tanstack/react-query";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const { data: userLoggedData, isLoading: _isLoadingRole } = useQuery({
    queryKey: ["GET_USERDATA"],
    queryFn: async () => {
      const response = await getUserData();
      return response;
    },
    retry: true,
    refetchOnWindowFocus: true,
  });

  return (
    <Nav>
      <MenuOutlined
        style={{ color: "#686868", cursor: "pointer" }}
        onClick={showDrawer}
      />
      {location.pathname.includes("home") ? (
        <></>
      ) : (
        <>
          <NavLinks>
            <li className={location.pathname === "/home" ? "active" : ""}>
              <RouteLabel to="/home">Home</RouteLabel>
            </li>
            <li className={location.pathname === "/usuarios" ? "active" : ""}>
              <RouteLabel to="/usuarios">Usuários</RouteLabel>
            </li>
            {userLoggedData!?.cargo === "ADMIN" && (
              <li
                className={location.pathname === "/municipios" ? "active" : ""}
              >
                <RouteLabel to="/municipios">Municípios</RouteLabel>
              </li>
            )}

            <li
              className={
                location.pathname === "/empreendimentos" ? "active" : ""
              }
            >
              <RouteLabel to="/empreendimentos">Empreendimentos</RouteLabel>
            </li>
            <li
              className={
                location.pathname === "/hierarquizacao" ? "active" : ""
              }
            >
              <RouteLabel to="/hierarquizacao">Hierarquizacao</RouteLabel>
            </li>
            <li
              className={location.pathname === "/beneficiarios" ? "active" : ""}
            >
              <RouteLabel to="/beneficiarios">Beneficiarios</RouteLabel>
            </li>
          </NavLinks>
          <LastElement></LastElement>
        </>
      )}

      <Drawer
        width={300}
        placement="left"
        closable={false}
        onClose={onClose}
        open={open}
        footer={
          <div style={{ padding: "10px 10px 10px 0px" }}>
            <div
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              style={{
                cursor: "pointer",
                maxWidth: "60px",
                display: "flex",
                flexDirection: "row",
                fontFamily: "Inter",
                fontSize: "16px",
                gap: "10px",
              }}
            >
              <LogoutOutlined />
              Sair
            </div>
          </div>
        }
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StartLogo src={start} />
          </div>
        }
      >
        <NavDrawer>
          <RouteLabelDrawer to="/home">Home</RouteLabelDrawer>
          <RouteLabelDrawer to="/usuarios">Usuários</RouteLabelDrawer>
          {userLoggedData!?.cargo === "ADMIN" && (
            <RouteLabelDrawer to="/municipios">Municípios</RouteLabelDrawer>
          )}

          <RouteLabelDrawer to="/empreendimentos">
            Empreendimentos
          </RouteLabelDrawer>
          <RouteLabelDrawer to="/hierarquizacao">
            Hierarquizacao
          </RouteLabelDrawer>
          <RouteLabelDrawer to="/beneficiarios">Beneficiários</RouteLabelDrawer>
        </NavDrawer>
      </Drawer>
    </Nav>
  );
};

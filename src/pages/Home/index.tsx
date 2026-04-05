import React, { useState } from "react";
import { LuUsersRound } from "react-icons/lu";
import { MdOutlinePlace } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { LuFolderPlus } from "react-icons/lu";

import { useNavigate } from "react-router-dom";

import {
  Grid,
  Container,
  GreetignLabelSub,
  GreetignLabel,
  ContainerRoute,
  ContainerRouteWrapper,
  RouteName,
  GridRoutes,
  RouteSubText,
  StartLogo,
} from "./styles";
import { useGreeting } from "../../hooks/useGreeting";
import { GiPodium } from "react-icons/gi";

import start from "../../assets/logo.png";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../../services/sga.requests";
import { Divider } from "antd";

export const Home = () => {
  const greeting = useGreeting();
  const navigate = useNavigate();

  const { data: userData, isLoading: _isLoading } = useQuery({
    queryKey: ["GET_USERDATA"],
    queryFn: async () => {
      const response = await getUserData();
      return response;
    },
    retry: true,
    refetchOnWindowFocus: false,
  });

  // const logout = () => {
  //   localStorage.removeItem("auth");
  //   navigate("/login");
  // };

  return (
    <>
      <Container>
        {/* <Navbar /> */}

        <div
          style={{
            display: "flex",
            padding: "5px 20px",
            marginTop: "10px",
            // flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <GreetignLabel>
              {greeting}, {userData!?.primeiroNome}!
            </GreetignLabel>
            <GreetignLabelSub style={{ marginLeft: "auto" }}>
              {/* {companyData?.name} */}
            </GreetignLabelSub>
            <GreetignLabelSub>Bom trabalho!</GreetignLabelSub>
          </div>
          <StartLogo src={start} style={{ marginLeft: "auto" }} />
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Divider style={{ margin: "10px 0px" }} />
        </div>
        <Grid>
          <ContainerRouteWrapper
            onClick={() => navigate("/usuarios")}
            style={{ background: "#EAF3DE", cursor: "pointer" }}
          >
            <ContainerRoute style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "20px 20px 0px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#C0DD97",
                    borderRadius: "100px",
                    height: "70px",
                    width: "70px",
                  }}
                >
                  <LuUsersRound size={"30px"} color="#27500A" />
                </div>
              </div>
            </ContainerRoute>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                width: "100%",
                justifyContent: "flex-start",
                padding: "20px 20px 0px",
              }}
            >
              <RouteName style={{ color: "#27500A" }}>
                Cadastro de Usuários
              </RouteName>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                width: "100%",
                justifyContent: "flex-start",
                padding: "20px",
              }}
            >
              <GridRoutes>
                <RouteSubText>Cadastro de Usuários</RouteSubText>
                <RouteSubText>Atribuição de cargos</RouteSubText>
              </GridRoutes>
            </div>
          </ContainerRouteWrapper>

          <ContainerRouteWrapper
            onClick={() => navigate("/municipios")}
            style={{
              background: "#E6F1FB",
              cursor: "pointer",
              // pointerEvents: "none",
              // opacity: "0.35",
            }}
          >
            <ContainerRoute style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "20px 20px 0px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#B5D4F4",
                    borderRadius: "100px",
                    height: "70px",
                    width: "70px",
                  }}
                >
                  <MdOutlinePlace size={"30px"} color="#0C447C" />
                </div>
              </div>
            </ContainerRoute>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                width: "100%",
                justifyContent: "flex-start",
                padding: "20px 20px 0px",
              }}
            >
              <RouteName style={{ color: "#0C447C" }}>
                Cadastro de Municípios
              </RouteName>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                width: "100%",
                justifyContent: "flex-start",
                padding: "20px",
              }}
            >
              <GridRoutes>
                <RouteSubText>Cadastro de Municios</RouteSubText>
                <RouteSubText>Informações Gerais</RouteSubText>
              </GridRoutes>
            </div>
          </ContainerRouteWrapper>

          <ContainerRouteWrapper
            onClick={() => navigate("/beneficiarios")}
            style={{
              background: "#FAECE7",
              cursor: "pointer",
              // pointerEvents: "none",
              // opacity: "0.35",
            }}
          >
            <ContainerRoute style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "20px 20px 0px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#F5C4B3",
                    borderRadius: "100px",
                    height: "70px",
                    width: "70px",
                    boxShadow:
                      "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                  }}
                >
                  <AiOutlineUsergroupAdd size={"30px"} color="#712B13" />
                </div>
              </div>
            </ContainerRoute>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                width: "100%",
                justifyContent: "flex-start",
                padding: "20px 20px 0px",
              }}
            >
              <RouteName style={{ color: "#712B13" }}>
                Cadastro de Beneficiários
              </RouteName>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                width: "100%",
                justifyContent: "flex-start",
                padding: "20px",
              }}
            >
              <GridRoutes>
                <RouteSubText>Informações gerais</RouteSubText>
                {/* <RouteSubText>Consulta de Dosiês</RouteSubText> */}
                <RouteSubText>Declarações e associações</RouteSubText>
              </GridRoutes>
            </div>
          </ContainerRouteWrapper>

          <ContainerRouteWrapper
            onClick={() => navigate("/empreendimentos")}
            style={{
              background: "#E1F5EE",
              cursor: "pointer",
              // pointerEvents: "none",
              // opacity: "0.35",
            }}
          >
            <ContainerRoute style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "20px 20px 0px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#9FE1CB",
                    borderRadius: "100px",
                    height: "70px",
                    width: "70px",
                    // boxShadow:
                    //   "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                  }}
                >
                  <LuFolderPlus size={"30px"} color="#085041" />
                </div>
              </div>
            </ContainerRoute>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                width: "100%",
                justifyContent: "flex-start",
                padding: "20px 20px 0px",
              }}
            >
              <RouteName style={{ color: "#085041" }}>
                Cadastro de Empreendimentos
              </RouteName>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                width: "100%",
                justifyContent: "flex-start",
                padding: "20px",
              }}
            >
              <GridRoutes>
                <RouteSubText>Vinculos de empreendimentos</RouteSubText>
                <RouteSubText>Informações Gerais</RouteSubText>
              </GridRoutes>
            </div>
          </ContainerRouteWrapper>

          <ContainerRouteWrapper
            onClick={() => navigate("/hierarquizacao")}
            style={{
              background: "#EEEDFE",
              cursor: "pointer",
              // pointerEvents: "none",
              // opacity: "0.35",
            }}
          >
            <ContainerRoute style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  width: "100%",
                  justifyContent: "flex-start",
                  padding: "20px 20px 0px",
                }}
              >
                <div
                  style={{
                    background: "#CCC9F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "100px",
                    height: "70px",
                    width: "70px",
                    // boxShadow:
                    //   "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                  }}
                >
                  <GiPodium size={"30px"} color="#3C3489" />
                </div>
              </div>
            </ContainerRoute>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                width: "100%",
                justifyContent: "flex-start",
                padding: "20px 20px 0px",
              }}
            >
              <RouteName style={{ color: "#3C3489" }}>Hierarquização</RouteName>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "start",
                width: "100%",
                justifyContent: "flex-start",
                padding: "20px",
              }}
            >
              <GridRoutes>
                <RouteSubText>Hierarquização familiar</RouteSubText>
                <RouteSubText>
                  Consulta de hierarquizações realizadas
                </RouteSubText>
              </GridRoutes>
            </div>
          </ContainerRouteWrapper>
        </Grid>
        {/* 
        <Footer /> */}
      </Container>
    </>
    // <>
    //   <Title>Área Administrativa START</Title>
    //   <Paragraph>
    //     Você está em uma rota privada renderizando um componente específico de
    //     admin.
    //   </Paragraph>
    //   <Button danger onClick={logout}>
    //     Sair
    //   </Button>
    // </>
    // </Layout>
  );
};

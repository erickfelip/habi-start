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

import start from "../../assets/start.png";

export const Home = () => {
  const greeting = useGreeting();
  const navigate = useNavigate();

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
            <GreetignLabel>{greeting}, Usuário!</GreetignLabel>
            <GreetignLabelSub style={{ marginLeft: "auto" }}>
              {/* {companyData?.name} */}
            </GreetignLabelSub>
            <GreetignLabelSub>Bom trabalho!</GreetignLabelSub>
          </div>
          <StartLogo src={start} style={{ marginLeft: "auto" }} />
        </div>
        <Grid>
          <ContainerRouteWrapper
            onClick={() => navigate("/usuarios")}
            style={{ background: "white", cursor: "pointer" }}
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
                    background: "white",
                    borderRadius: "100px",
                    height: "70px",
                    width: "70px",
                    boxShadow:
                      "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                  }}
                >
                  <LuUsersRound size={"30px"} />
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
              <RouteName>Cadastro de Usuários</RouteName>
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
              background: "white",
              // cursor: "not-allowed",
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
                    background: "white",
                    borderRadius: "100px",
                    height: "70px",
                    width: "70px",
                    boxShadow:
                      "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                  }}
                >
                  <MdOutlinePlace size={"30px"} />
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
              <RouteName>Cadastro de Municípios</RouteName>
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
              background: "white",
              // cursor: "not-allowed",
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
                    background: "white",
                    borderRadius: "100px",
                    height: "70px",
                    width: "70px",
                    boxShadow:
                      "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                  }}
                >
                  <AiOutlineUsergroupAdd size={"30px"} />
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
              <RouteName>Cadastro de Beneficiários</RouteName>
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
            onClick={() => navigate("/projetos")}
            style={{
              background: "white",
              // cursor: "not-allowed",
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
                    background: "white",
                    borderRadius: "100px",
                    height: "70px",
                    width: "70px",
                    boxShadow:
                      "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                  }}
                >
                  <LuFolderPlus size={"30px"} />
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
              <RouteName>Cadastro de Projetos</RouteName>
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
                <RouteSubText>Vinculos de projetos</RouteSubText>
                <RouteSubText>Informações Gerais</RouteSubText>
              </GridRoutes>
            </div>
          </ContainerRouteWrapper>

          <ContainerRouteWrapper
            onClick={() => navigate("/beneficiarios")}
            style={{
              background: "white",
              // cursor: "not-allowed",
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
                    background: "white",
                    borderRadius: "100px",
                    height: "70px",
                    width: "70px",
                    boxShadow:
                      "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
                  }}
                >
                  <GiPodium size={"30px"} />
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
              <RouteName>Sorteio</RouteName>
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
                <RouteSubText>Sorteio habitacionais</RouteSubText>
                <RouteSubText>Consulta de sorteios realizados</RouteSubText>
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

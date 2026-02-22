import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoAlert } from "react-icons/io5";

import {
  ButtonSolicitation,
  Container,
  GreetignLabelSub,
  Label,
  LabelSub,
  WrapperTable,
} from "./styles";
import { IoAdd } from "react-icons/io5";

import {
  Badge,
  Divider,
  Dropdown,
  Tooltip,
  Table,
  Tag,
  Tabs,
  Input,
  Pagination,
  notification,
  Button,
} from "antd";
import moment from "moment";

import "antd/dist/reset.css";
import {
  MdOutlineFilterList,
  MdOutlinePublishedWithChanges,
} from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useWindowSize } from "../../hooks/useWindowSize";
import { getMunicipios } from "../../services/sga.requests";
import { ModalCreateMunicipio } from "../../components/ModalCreateMunicipio";

export const Municipios = () => {
  const [openOrderDetailsModal, setOpenOrderDetailsModal] = useState(false);
  const [openSolicitationModal, setOpenSolicitationModal] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  // BUSCA DE MUNICIPOS
  const { data: municipios = [], isLoading } = useQuery({
    queryKey: ["GET_MUNICIPIOS"],
    queryFn: async () => {
      const response = await getMunicipios();
      return response;
    },
    retry: true,
    refetchOnWindowFocus: false,
  });

  const columns: any = [
    {
      title: "Nome do municipio",
      dataIndex: "nome",
      key: "nome",
      align: "start",
      render: (_: any, record: any) => {
        return record?.nome;
      },
    },
    {
      title: "Ações",
      key: "action",
      render: (_: any, record: any) => (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                cursor: "pointer",
                background: "#1677ff2d",
                height: "30px",
                width: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5px",
                boxShadow:
                  "rgba(0, 0, 0, 0.10) 0px 1px 3px, rgba(0, 0, 0, 0.10) 0px 1px 2px",
              }}
            >
              <Tooltip title="Detalhes">
                {record?.priority !== null ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Badge
                      offset={[5, -3]}
                      count={
                        <div
                          style={{
                            background: "red",
                            borderRadius: "16px",
                            height: "16px",
                            width: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IoAlert color="white" size={"14px"} />
                        </div>
                      }
                    >
                      <FiEye
                        size={20}
                        color="#1677ff"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setOrderData(record); // segurando cache?
                          setOpenOrderDetailsModal(true);
                        }}
                      />
                    </Badge>
                  </div>
                ) : (
                  <FiEye
                    size={20}
                    color="#1677ff"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOrderData(record);
                      setOpenOrderDetailsModal(true);
                    }}
                  />
                )}
              </Tooltip>
            </span>
          </div>
        </>
      ),
    },
  ];

  const [orderNumber, setOrderNumber] = useState("");
  const [filter, setFilter] = useState("orderNumber");
  const [page, setPage] = useState(1);
  // const debouncedValue = useDebounce(orderNumber, 500);

  const { width } = useWindowSize();

  return (
    <Container>
      {/* <Navbar /> */}
      {/* <Chat /> */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "20px",
          height: "40px", // alura padrão
        }}
      >
        <div>
          <Label>Municipios Cadastrados </Label>
          {/* <GreetignLabelSub style={{ marginLeft: "auto" }}>
            | {loadingCompanyName ? "..." : companyData?.name}
          </GreetignLabelSub> */}
        </div>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}
      >
        <LabelSub>Últimos municipios cadastrados.</LabelSub>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          flexDirection: "column",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <Divider style={{ margin: "20px 0" }} />
        <>
          <div style={{ display: "flex", width: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                paddingBottom: "20px",
                gap: "8px",
              }}
            >
              <Input
                placeholder="Informe o nome do municipio"
                allowClear
                size="large"
                onChange={(e) => setOrderNumber(e.target.value)}
                value={orderNumber}
                style={{ width: "500px", borderRadius: "20px" }}
              />
              {/* 
              <Dropdown
                arrow={{ pointAtCenter: true }}
                menu={{
                  selectedKeys: [filter],
                  onClick: (e) => setFilter(e.key),
                  items: [
                    {
                      key: "orderNumber",
                      label: "Nome",
                    },
                  ],
                }}
              >
                <MdOutlineFilterList
                  style={{ cursor: "pointer" }}
                  size={"33px"}
                  color="#626262"
                />
              </Dropdown> */}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "auto",
                gap: "15px",
                paddingBottom: "20px",
              }}
            >
              <ButtonSolicitation
                onClick={() => setOpenSolicitationModal(true)}
                size="large"
                color="orange"
                variant="solid"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: "7px",
                    padding: "20px",
                    fontSize: "14px",
                  }}
                >
                  <IoAdd color="white" size={15} />
                  Adicionar município
                </div>
              </ButtonSolicitation>
            </div>
          </div>
          <div
            style={{
              borderRadius: "20px",
              marginBottom: "3px",
              width: "100%",
            }}
          >
            <WrapperTable>
              <Table
                showHeader
                loading={isLoading}
                style={{
                  padding: "10px",
                  width: "100%",
                }}
                columns={columns}
                dataSource={municipios}
                pagination={false}
                locale={{ emptyText: "Nenhum dado disponível" }}
              />
            </WrapperTable>
          </div>
          <Pagination
            current={page}
            onChange={(value: React.SetStateAction<number>) => setPage(value)}
            // total={
            //   solicitations!?.count
            //     ? Math.ceil(solicitations!?.count / 10) * 10
            //     : 1
            // }
            style={{ alignSelf: "center", marginTop: "10px" }}
            showSizeChanger={false}
          />
          {/* EDIÇÃO DE MUNICIPOS SÓ O NOME */}
          {/* <ModalOrderDetails
            isOpen={openOrderDetailsModal}
            handleClose={() => {
              refetch();
              setOpenOrderDetailsModal(false);
            }}
            orderData={orderData}
          /> */}
          {/* ADICIONAR MUNICIPOS */}
          <ModalCreateMunicipio
            isOpen={openSolicitationModal}
            handleClose={() => setOpenSolicitationModal(false)}
          />
        </>
      </div>
    </Container>
  );
};

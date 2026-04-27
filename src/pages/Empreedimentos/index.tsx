import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ButtonSolicitation,
  Container,
  Label,
  LabelSub,
  WrapperTable,
} from "./styles";
import { IoAdd } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";
import {
  Divider,
  Tooltip,
  Table,
  Tag,
  Input,
  Pagination,
  notification,
  Button,
  Alert,
  Popover,
} from "antd";

import "antd/dist/reset.css";
import { MdDelete } from "react-icons/md";

import {
  deleteEmpreendimento,
  getEmpreendimentos,
} from "../../services/sga.requests";
import { Navbar } from "../../components/NavBar";
import { ModalCreateEmpreendimento } from "../../components/ModalCreateEmpreendimento";
import { ModalIndicacaoDireta } from "../../components/ModalIndicacaoDireta";

export const Empreendimentos = () => {
  const [_openOrderDetailsModal, setOpenOrderDetailsModal] = useState(false);
  const [openSolicitationModal, setOpenSolicitationModal] = useState(false);
  const [_orderData, setOrderData] = useState<any>(null);
  const [openPopOver, setOpenPopOver] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: empreendimentos = [], isLoading } = useQuery({
    queryKey: ["GET_EMPREENDIMENTOS"],
    queryFn: async () => {
      const response = await getEmpreendimentos();
      return response!?.rows;
    },
    retry: true,
    refetchOnWindowFocus: true,
  });

  const hide = () => {
    setOpenPopOver(null);
  };

  const handleOpenPopOverChange = (visible: boolean, id: string) => {
    if (visible) {
      setOpenPopOver(id);
    } else {
      setOpenPopOver(null);
    }
  };

  const handleDeleteEmpreedimento = async (id: string) => {
    await deleteEmpreendimento({ id: id })
      .then(() => {
        notification.success({
          duration: 3,
          message: "Sucesso!",
          description: `Empreendimento deletado.`,
        });
        queryClient.invalidateQueries({
          queryKey: ["GET_EMPREENDIMENTOS"],
        });
        hide();
      })
      .catch((error) => {
        notification.error({
          duration: 1,
          message: "Erro!",
          description: `${error?.response?.data?.message}`,
        });
        return;
      });
  };

  const columns: any = [
    {
      title: "Nome do empreedimento",
      dataIndex: "label",
      key: "label",
      align: "start",
      render: (_: any, record: any) => {
        return record?.label;
      },
    },
    {
      title: "Quantidade de vagas",
      dataIndex: "qtd",
      key: "qtd",
      align: "start",
      render: (_: any, record: any) => {
        return record?.qtd;
      },
    },
    {
      title: "Faixa MCMV",
      dataIndex: "faixaNome",
      key: "faixaNome",
      align: "start",
      render: (_: any, record: any) => {
        return record?.faixaNome;
      },
    },
    {
      title: "Cotas",
      dataIndex: "data",
      key: "data",
      align: "start",
      render: (_: any, record: any) => {
        return (
          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
            <Tag color={"red"}>
              Vulnerabilidade {record!?.pVulnerabilidade}%
            </Tag>
            <Tag color={"blue"}>Idosos {record!?.pIdosos}%</Tag>
            <Tag color={"blue"}> PCD {record!?.pPcd}%</Tag>
            <Tag color={"geekblue"}>
              Ampla concorrência {record!?.pAmplaConcorrencia}%
            </Tag>
          </div>
        );
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
            <Tooltip title="Indicação direta">
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
                <GrGroup
                  size={16}
                  color="#1677ff"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOrderData(record);
                    setOpenOrderDetailsModal(true);
                  }}
                />
              </span>
            </Tooltip>

            <Popover
              content={
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Divider style={{ margin: "15px 0px" }} />

                  <div style={{ display: "flex", maxWidth: "430px" }}>
                    <Alert
                      message={
                        <span style={{ fontWeight: "bold" }}>Atenção!</span>
                      }
                      type="warning"
                      showIcon
                      description={
                        <span
                          style={{
                            fontFamily: "Inter",
                            fontSize: "14px",
                            fontWeight: "400",
                          }}
                        >
                          Você está prestes a deletar o empreedimento{" "}
                          <span style={{ fontWeight: "500", color: "black" }}>
                            {record?.nome},
                          </span>{" "}
                          tem certeza que deseja seguir com essa ação?
                        </span>
                      }
                    />
                  </div>

                  <Divider style={{ margin: "15px 0px" }} />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                      marginLeft: "auto",
                    }}
                  >
                    <Button danger onClick={hide}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        handleDeleteEmpreedimento(record!?.id);
                      }}
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              }
              trigger="click"
              open={openPopOver === record?.id}
              onOpenChange={(visible) =>
                handleOpenPopOverChange(visible, record?.id)
              }
            >
              <Tooltip title="Deletar empreendimento" placement="bottom">
                <Button
                  style={{
                    cursor: "pointer",
                    background: "#ff16162c",
                    height: "30px",
                    width: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    boxShadow:
                      "rgba(0, 0, 0, 0.10) 0px 1px 3px, rgba(0, 0, 0, 0.10) 0px 1px 2px",
                  }}
                  icon={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MdDelete
                        style={{ color: "#ff2020b3", fontSize: "19px" }}
                      />
                    </div>
                  }
                />
              </Tooltip>
            </Popover>
          </div>
        </>
      ),
    },
  ];

  const [orderNumber, setOrderNumber] = useState("");
  const [_filter, _setFilter] = useState("orderNumber");
  const [page, setPage] = useState(1);
  // const debouncedValue = useDebounce(orderNumber, 500);

  return (
    <Container>
      <Navbar />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "20px",
          height: "40px", // alura padrão
        }}
      >
        <div>
          <Label>Empreendimentos Cadastrados </Label>
        </div>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}
      >
        <LabelSub>Últimos empreendimentos cadastrados.</LabelSub>
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
                placeholder="Informe o nome do empreedimento"
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
                    fontWeight: "500",
                    fontFamily: "Inter",
                  }}
                >
                  <IoAdd color="white" size={15} />
                  Adicionar empreendimento
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
                dataSource={empreendimentos}
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
          <ModalCreateEmpreendimento
            isOpen={openSolicitationModal}
            handleClose={() => setOpenSolicitationModal(false)}
          />

          <ModalIndicacaoDireta
            orderData={_orderData}
            isOpen={_openOrderDetailsModal}
            handleClose={() => setOpenOrderDetailsModal(false)}
          />
        </>
      </div>
    </Container>
  );
};

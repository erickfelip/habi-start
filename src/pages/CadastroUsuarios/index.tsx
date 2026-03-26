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

import {
  Divider,
  Tooltip,
  Table,
  Input,
  Pagination,
  notification,
  Button,
  Alert,
  Popover,
} from "antd";

import "antd/dist/reset.css";
import { MdDelete } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { useWindowSize } from "../../hooks/useWindowSize";
import { getUsers, deleteUser } from "../../services/sga.requests";
import { ModalCreateUser } from "../../components/ModalCreateUser";
import { Navbar } from "../../components/NavBar";

export const CadastroUsuarios = () => {
  const [openOrderDetailsModal, setOpenOrderDetailsModal] = useState(false);
  const [openSolicitationModal, setOpenSolicitationModal] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<any>(["GET_USERDATA"]);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["GET_USUARIOS"],
    queryFn: async () => {
      const response = await getUsers(user!?.idMunicipio);
      return response;
    },
    retry: true,
    refetchOnWindowFocus: false,
  });

  const [openPopOver, setOpenPopOver] = useState<string | null>(null);

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

  const handleDeleteMunicipio = async (id: string) => {
    await deleteUser({ id: id })
      .then(() => {
        notification.success({
          duration: 3,
          message: "Sucesso!",
          description: `Usuário deletado.`,
        });
        queryClient.invalidateQueries({
          queryKey: ["GET_USUARIOS"],
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
      title: "Nome do usuário",
      dataIndex: "nome",
      key: "nome",
      align: "start",
      render: (_: any, record: any) => {
        return (
          <>
            {record?.primeiroNome} {record?.segundoNome}
          </>
        );
      },
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
      align: "start",
      render: (_: any, record: any) => {
        return <>{record?.cargo}</>;
      },
    },
        {
      title: "E-mail",
      dataIndex: "login",
      key: "login",
      align: "start",
      render: (_: any, record: any) => {
        return <>{record?.login?.email}</>;
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
            {/* <span
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
                <FiEye
                  size={20}
                  color="#1677ff"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOrderData(record);
                    setOpenOrderDetailsModal(true);
                  }}
                />
              </Tooltip>
            </span> */}

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
                          Você está prestes a deletar o usuário{" "}
                          <span style={{ fontWeight: "500", color: "black" }}>
                            {record?.primeiroNome} {record.segundoNome},
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
                        handleDeleteMunicipio(record!?.id);
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
              <Tooltip title="Deletar usuário" placement="bottom">
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
  const [filter, setFilter] = useState("orderNumber");
  const [page, setPage] = useState(1);
  // const debouncedValue = useDebounce(orderNumber, 500);

  const { width } = useWindowSize();

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
          <Label>Usuários cadastrados </Label>
        </div>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}
      >
        <LabelSub>Últimos usuários cadastrados.</LabelSub>
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
                placeholder="Informe o nome do usuario"
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
                  Cadastrar usuário
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
                dataSource={users}
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
          <ModalCreateUser
            isOpen={openSolicitationModal}
            handleClose={() => setOpenSolicitationModal(false)}
          />
        </>
      </div>
    </Container>
  );
};

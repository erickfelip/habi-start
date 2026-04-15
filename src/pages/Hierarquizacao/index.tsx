import { useMemo, useState } from "react";
import {
  ButtonSolicitation,
  Container,
  GridSelected,
  Label,
  LabelSub,
} from "./styles";
import { FaUserAltSlash } from "react-icons/fa";
import {
  notification,
  Select,
  List,
  Tabs,
  Tag,
  Badge,
  Tooltip,
  Empty,
  Button,
  Popover,
  Divider,
  Alert,
} from "antd";
import "antd/dist/reset.css";
import { Navbar } from "../../components/NavBar";

import { formatLabel } from "../../utils";
import {
  createHierarquizacao,
  getEmpreendimentos,
  getHierarquizacao,
  reprovarBeneficiario,
} from "../../services/sga.requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ModalEntrevista } from "../../components/ModalEntrevista";

type Pessoa = {
  nome: string;
  cpf: string;
};

type Vaga = {
  sorteados: Pessoa[];
  cadastroReserva: Pessoa[];
  cota: string;
  totalVagas: number;
};

type Vagas = {
  [key: string]: Vaga;
};

export const Hierarquizacao = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<string>("1");
  const [openSolicitationModal, setOpenSolicitationModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [selected, setSelected] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [vagas, setVagas] = useState<Vagas>({});
  const [vagasGet, setVagasGet] = useState<Vagas>({});
  const [activeTab, setActiveTab] = useState<string>("PCD");
  const [pageByTab, setPageByTab] = useState<Record<string, number>>({});

  const { data: empreendimentos = [], isLoading } = useQuery({
    queryKey: ["GET_EMPREENDIMENTOS"],
    queryFn: async () => {
      const response = await getEmpreendimentos();
      return response!?.rows;
    },
    retry: true,
    refetchOnWindowFocus: true,
  });

  const { data: _hierarquizacao = [], isLoading: _loadingHierarquizacao } =
    useQuery({
      queryKey: ["GET_HIERARQUIZACAO", selected, vagas],
      queryFn: async () => {
        const response = await getHierarquizacao(selected);
        const vagas = response!?.rows!?.[0]!?.resultado!?.vagas;
        setVagasGet(vagas ?? []);
        return response!?.rows!?.[0]!?.resultado;
      },
      retry: true,
      refetchOnWindowFocus: false,
      enabled: selected !== null && tab.includes("2") ? true : false,
    });

  const handleConfirm = async () => {
    setLoading(true);
    const payload = {
      idEmpreendimento: selected,
    };

    await createHierarquizacao(payload)
      .then((res) => {
        const vagas: Vagas = res!?.vagas;
        setVagas(vagas);
        setSelected(null);
        notification.success({
          duration: 3,
          message: "Sucesso!",
          description: `Hierarquização criada.`,
        });
        setLoading(false);
      })
      .catch((error: any) => {
        notification.error({
          duration: 1,
          message: "Erro!",
          description: `${error?.response?.data?.message}`,
        });
        return;
      });
  };

  const listaCombinadaPost = useMemo(() => {
    if (!vagas[activeTab]) return [];

    const vagaAtual = vagas[activeTab];

    return [
      ...vagaAtual.sorteados.map((item) => ({
        ...item,
        tipo: "SORTEADO",
      })),
      ...vagaAtual.cadastroReserva.map((item) => ({
        ...item,
        tipo: "RESERVA",
      })),
    ];
  }, [activeTab, vagas]);

  const listaCombinadaGet = useMemo(() => {
    if (!vagasGet[activeTab]) return [];

    const vagaAtual = vagasGet[activeTab];

    return [
      ...vagaAtual.sorteados.map((item) => ({
        ...item,
        tipo: "SORTEADO",
      })),
      ...vagaAtual.cadastroReserva.map((item) => ({
        ...item,
        tipo: "RESERVA",
      })),
    ];
  }, [activeTab, vagasGet]);

  const onChange = (key: string) => {
    setTab(key);
  };

  const handleChangeEmpreendimento = (_value: any, option: any) => {
    setSelected(option!?.value);
  };

  const filterOption = (input: any, option: any) => {
    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const items = [
    {
      key: "1",
      label: "Realizar hierarquização",
      children: <></>,
    },
    {
      key: "2",
      label: "Hierarquizações realizadas",
      children: <></>,
    },
  ];

  const handlePageChange = (page: number) => {
    setPageByTab((prev) => ({
      ...prev,
      [activeTab]: page,
    }));
  };

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

  const handleReprovarBeneficiario = async (id: string) => {
    const payload = {
      status: "REPROVADO",
    };
    await reprovarBeneficiario({ id: id, payload: payload })
      .then(() => {
        notification.success({
          duration: 3,
          message: "Sucesso!",
          description: `beneficiário reprovado.`,
        });
        queryClient.invalidateQueries({
          queryKey: ["GET_HIERARQUIZACAO"],
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

  return (
    <Container>
      <Navbar />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "20px",
          height: "40px",
        }}
      >
        <div>
          <Label>Hierarquização</Label>
        </div>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}
      >
        <LabelSub>Conectando famílias ao sonho da moradia.</LabelSub>
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
        <div style={{ width: "100%" }}>
          <Tabs defaultActiveKey="1" activeKey={tab} onChange={onChange}>
            {items.map((item) => (
              <Tabs.TabPane tab={item.label} key={item.key}>
                {item.children}
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div>
        <>
          {tab.includes("1") ? (
            <>
              <GridSelected style={{ marginBottom: "20px", marginTop: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Selecione o empreedimento"
                    showSearch
                    allowClear
                    size="large"
                    loading={isLoading}
                    filterOption={filterOption}
                    optionFilterProp="children"
                    options={empreendimentos!?.map((empreendimento: any) => {
                      return {
                        label: empreendimento.label,
                        value: empreendimento.id,
                      };
                    })}
                    onChange={(value, option) =>
                      handleChangeEmpreendimento(value, option)
                    }
                  />
                </div>
                <div style={{ display: "flex", width: "100%" }}>
                  <ButtonSolicitation
                    onClick={handleConfirm}
                    size="large"
                    color="blue"
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
                        fontSize: "16px",
                        fontWeight: "500",
                        fontFamily: "Inter",
                      }}
                    >
                      Iniciar hierarquização
                    </div>
                  </ButtonSolicitation>
                </div>
              </GridSelected>

              <div
                style={{
                  borderRadius: "20px",
                  marginBottom: "3px",
                  width: "100%",
                }}
              >
                <List
                  locale={{
                    emptyText: (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginTop: "20px",
                        }}
                      >
                        <Empty description={false} />
                        <span>Nenhuma hierarquização registrada.</span>
                        <span>
                          Para iniciar o processo de hierarquização, selecione o
                          empreendimento e clique em "Iniciar hierarquização"
                        </span>
                      </div>
                    ),
                  }}
                  pagination={{
                    current: pageByTab[activeTab] || 1,
                    pageSize: 10,
                    onChange: handlePageChange,
                    showSizeChanger: false,
                  }}
                  loading={loading}
                  header={
                    <>
                      <Tabs
                        style={{ height: "33px !importante" }}
                        defaultActiveKey="PCD"
                        activeKey={activeTab}
                        onChange={(key) => {
                          setActiveTab(key);
                          setPageByTab((prev) => ({ ...prev, [key]: 1 }));
                        }}
                        // onChange={(key) => setActiveTab(key)}
                        items={Object.entries(vagas!)?.map(
                          ([key, value]: any) => ({
                            key,
                            label: (
                              <span>
                                {formatLabel(key)}{" "}
                                <Tooltip
                                  placement="bottom"
                                  title={`Vagas por cota ${value?.cota}`}
                                >
                                  <Badge
                                    overflowCount={9999}
                                    count={value?.totalVagas}
                                    style={{ backgroundColor: "#1890ff" }}
                                  />
                                </Tooltip>
                              </span>
                            ),
                          })
                        )}
                      ></Tabs>
                    </>
                  }
                  style={{ marginTop: 0, background: "white", padding: "3px" }}
                  bordered
                  dataSource={listaCombinadaPost}
                  renderItem={(item: any) => (
                    <List.Item
                      style={{
                        backgroundColor:
                          item?.tipo === "RESERVA" ? "#fffbe6" : "#ffffff",
                      }}
                    >
                      <List.Item.Meta
                        title={
                          <>
                            {item?.nome}{" "}
                            {item?.tipo === "RESERVA" && (
                              <Tag color="gold">Cadastro Reserva</Tag>
                            )}
                          </>
                        }
                        description={item.cpf}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </>
          ) : (
            <>
              <GridSelected style={{ marginBottom: "20px", marginTop: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Selecione o empreedimento"
                    showSearch
                    allowClear
                    size="large"
                    loading={isLoading}
                    filterOption={filterOption}
                    optionFilterProp="children"
                    options={empreendimentos!?.map((empreendimento: any) => {
                      return {
                        label: empreendimento.label,
                        value: empreendimento.id,
                      };
                    })}
                    onChange={(value, option) =>
                      handleChangeEmpreendimento(value, option)
                    }
                  />
                </div>
                {/* <div style={{ display: "flex", width: "100%" }}>
                  <ButtonSolicitation
                    onClick={handleConfirm}
                    size="large"
                    color="blue"
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
                        fontSize: "16px",
                        fontWeight: "500",
                        fontFamily: "Inter",
                      }}
                    >
                      Iniciar hierarquização
                    </div>
                  </ButtonSolicitation>
                </div> */}
              </GridSelected>

              <div
                style={{
                  borderRadius: "20px",
                  marginBottom: "3px",
                  width: "100%",
                }}
              >
                <List
                  locale={{
                    emptyText: (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginTop: "20px",
                        }}
                      >
                        <Empty description={false} />
                        <span>Nenhuma hierarquização encontrada.</span>
                        <span>
                          Selecione o empreendimento para visualziar as
                          hierarquizações registradas.
                        </span>
                      </div>
                    ),
                  }}
                  pagination={{
                    current: pageByTab[activeTab] || 1,
                    pageSize: 10,
                    onChange: handlePageChange,
                    showSizeChanger: false,
                  }}
                  loading={loading}
                  header={
                    <>
                      <Tabs
                        style={{ height: "33px !importante" }}
                        defaultActiveKey="PCD"
                        activeKey={activeTab}
                        onChange={(key) => {
                          setActiveTab(key);
                          setPageByTab((prev) => ({ ...prev, [key]: 1 }));
                        }}
                        // onChange={(key) => setActiveTab(key)}
                        items={Object.entries(vagasGet!)?.map(
                          ([key, value]: any) => ({
                            key,
                            label: (
                              <span>
                                {formatLabel(key)}{" "}
                                <Tooltip
                                  placement="bottom"
                                  title={`Vagas por cota ${value?.cota}`}
                                >
                                  <Badge
                                    overflowCount={9999}
                                    count={value?.totalVagas}
                                    style={{ backgroundColor: "#1890ff" }}
                                  />
                                </Tooltip>
                              </span>
                            ),
                          })
                        )}
                      ></Tabs>
                    </>
                  }
                  style={{ marginTop: 0, background: "white", padding: "3px" }}
                  bordered
                  dataSource={listaCombinadaGet}
                  renderItem={(item: any) => (
                    <List.Item
                      style={{
                        backgroundColor:
                          item?.tipo === "RESERVA" ? "#fffbe6" : "#ffffff",
                      }}
                    >
                      <List.Item.Meta
                        title={
                          <>
                            {item?.nome}{" "}
                            {item?.tipo === "RESERVA" && (
                              <Tag color="gold">Cadastro Reserva</Tag>
                            )}
                          </>
                        }
                        description={item.cpf}
                      />

                      <List.Item.Meta
                        style={{
                          marginLeft: "auto",
                        }}
                        title={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              gap: "7px",
                            }}
                          >
                            <Popover
                              content={
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Divider style={{ margin: "15px 0px" }} />

                                  <div
                                    style={{
                                      display: "flex",
                                      maxWidth: "430px",
                                    }}
                                  >
                                    <Alert
                                      message={
                                        <span style={{ fontWeight: "bold" }}>
                                          Atenção!
                                        </span>
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
                                          Você está prestes a reprovar o
                                          beneficiário{" "}
                                          <span
                                            style={{
                                              fontWeight: "500",
                                              color: "black",
                                            }}
                                          >
                                            {item?.nome},
                                          </span>{" "}
                                          tem certeza que deseja seguir com essa
                                          ação?
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
                                        handleReprovarBeneficiario(item!?.id);
                                      }}
                                    >
                                      Confirmar
                                    </Button>
                                  </div>
                                </div>
                              }
                              trigger="click"
                              open={openPopOver === item?.id}
                              onOpenChange={(visible) =>
                                handleOpenPopOverChange(visible, item?.id)
                              }
                            >
                              <Tooltip
                                title="Reprovar beneficiário"
                                placement="bottom"
                              >
                                <Button
                                  style={{
                                    cursor: "pointer",
                                    background: "#ff16162c",
                                    height: "40px",
                                    width: "40px",
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
                                      <FaUserAltSlash
                                        style={{
                                          color: "#ff2020b3",
                                          fontSize: "19px",
                                        }}
                                      />
                                    </div>
                                  }
                                />
                              </Tooltip>
                            </Popover>

                            <Button
                              type="primary"
                              htmlType="submit"
                              block
                              size="large"
                              style={{
                                backgroundColor: "#209df0",
                                maxWidth: "250px",
                              }}
                              onClick={() => {
                                setUserData(item);
                                setOpenSolicitationModal(true);
                              }}
                            >
                              Entrevista beneficiário
                            </Button>
                          </div>
                        }
                        // description={item.cpf}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </>
          )}

          <ModalEntrevista
            isOpen={openSolicitationModal}
            handleClose={() => setOpenSolicitationModal(false)}
            userData={userData}
          />
        </>
      </div>
    </Container>
  );
};

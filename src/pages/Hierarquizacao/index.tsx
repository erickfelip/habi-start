import { useState } from "react";
import {
  ButtonSolicitation,
  Container,
  Grid,
  GridSelected,
  Label,
  LabelSub,
  SelectableCard,
} from "./styles";
import { Divider, Input, notification, Form, Select, List, Tabs } from "antd";
import "antd/dist/reset.css";
import { Navbar } from "../../components/NavBar";
import { ModalSorteio } from "../../components/ModalSorteio";

const mockEmpreendimento = [
  {
    label: "Henrique paiva",
    value: "a9b52b4a-d11a-4785-bf85-01335fb4542d",
    p_idosos: 3,
    p_vulnerabilidade: 50,
    p_pcd: 3,
    p_ampla_concorrencia: 44,
    qtd: 240,
  },
  {
    label: "Maria Belo",
    value: "ad8ace56-4ac9-4fc8-8691-bf430002f3d9 ",
    p_idosos: 3,
    p_vulnerabilidade: 50,
    p_pcd: 3,
    p_ampla_concorrencia: 44,
    qtd: 240,
  },
];

const mockListas = {
  idosos: [
    { nome: "João X", cpf: "874.XXX.XXX-10" },
    { nome: "Maria X", cpf: "874.XXX.XXX-10" },
    { nome: "Carlos X", cpf: "874.XXX.XXX-10" },
    { nome: "Ana X", cpf: "874.XXX.XXX-10" },
    { nome: "Paulo X", cpf: "874.XXX.XXX-10" },
    { nome: "Fernanda X", cpf: "874.XXX.XXX-10" },
    { nome: "Ricardo X", cpf: "874.XXX.XXX-10" },
  ],
  vulnerabilidade: [
    { nome: "Lucas X", cpf: "874.XXX.XXX-10" },
    { nome: "Beatriz X", cpf: "874.XXX.XXX-10" },
    { nome: "Gabriel X", cpf: "874.XXX.XXX-10" },
    { nome: "Camila X", cpf: "874.XXX.XXX-10" },
    { nome: "Thiago X", cpf: "874.XXX.XXX-10" },
    { nome: "Amanda X", cpf: "874.XXX.XXX-10" },
    { nome: "Felipe X", cpf: "874.XXX.XXX-10" },
    { nome: "Larissa X", cpf: "874.XXX.XXX-10" },
    { nome: "Bruno X", cpf: "874.XXX.XXX-10" },
    { nome: "Daniela X", cpf: "874.XXX.XXX-10" },
  ],
  pcd: [
    { nome: "Rafael X", cpf: "874.XXX.XXX-10" },
    { nome: "Vanessa X", cpf: "874.XXX.XXX-10" },
    { nome: "Eduardo X", cpf: "874.XXX.XXX-10" },
    { nome: "Aline X", cpf: "874.XXX.XXX-10" },
    { nome: "Marcelo X", cpf: "874.XXX.XXX-10" },
    { nome: "Carla X", cpf: "874.XXX.XXX-10" },
    { nome: "Diego X", cpf: "874.XXX.XXX-10" },
  ],
  ampla: [
    { nome: "Gustavo X", cpf: "874.XXX.XXX-10" },
    { nome: "Tatiane X", cpf: "874.XXX.XXX-10" },
    { nome: "Henrique X", cpf: "874.XXX.XXX-10" },
    { nome: "Monica X", cpf: "874.XXX.XXX-10" },
    { nome: "Rodrigo X", cpf: "874.XXX.XXX-10" },
    { nome: "Elaine X", cpf: "874.XXX.XXX-10" },
    { nome: "Victor X", cpf: "874.XXX.XXX-10" },
    { nome: "Simone X", cpf: "874.XXX.XXX-10" },
    { nome: "André X", cpf: "874.XXX.XXX-10" },
    { nome: "Kelly X", cpf: "874.XXX.XXX-10" },
  ],
};

export const Hierarquizacao = () => {
  const [tab, setTab] = useState<string>("1");
  const [openSolicitationModal, setOpenSolicitationModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form] = Form.useForm();
  const [listaSelecionada, setListaSelecionada] = useState([]);
  const [cards, setCards] = useState<any>([
    { key: "idosos", label: "Idosos (3%)", value: 0 },
    { key: "vulnerabilidade", label: "Vulnerabilidade (50%)", value: 0 },
    { key: "pcd", label: "PCD (3%)", value: 0 },
    { key: "ampla concorrềncia", label: "Ampla Concorrência (44%)", value: 0 },
  ]);

  const handleConfirm = () => {
    if (!selected) return;
    setListaSelecionada(mockListas[selected]);
  };

  const onChange = (key: string) => {
    setTab(key);
  };

  const handleChangeEmpreendimento = (_value: any, option: any) => {
    const { p_idosos, p_vulnerabilidade, p_pcd, p_ampla_concorrencia, qtd } =
      option;

    const calc = (percent: any) => Math.round((percent / 100) * qtd);

    const idosos = calc(p_idosos);
    const vulnerabilidade = calc(p_vulnerabilidade);
    const pcd = calc(p_pcd);
    const ampla = calc(p_ampla_concorrencia); // resto

    setCards([
      { key: "idosos", label: "Idosos (3%)", value: idosos },
      {
        key: "vulnerabilidade",
        label: "Vulnerabilidade (50%)",
        value: vulnerabilidade,
      },
      { key: "pcd", label: "PCD (3%)", value: pcd },
      { key: "ampla", label: "Ampla Concorrência (44%)", value: ampla },
    ]);

    setSelected(null);
  };

  const onFinish = async (values: any) => {
    const payload = {
      empreendimento: values.empreendimento,
      qtd: values.qtd,
      classificacao: values.classificacao,
    };

    form.resetFields();
    notification.success({
      duration: 3,
      message: "Sucesso!",
      description: `Novo empreendimento cadastrado.`,
    });
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
              <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                style={{ width: "100%" }}
              >
                <GridSelected>
                  <Form.Item
                    label="Nome do empreendimento:"
                    name="empreendimento"
                    rules={[{ required: true, message: "Campo obrigatório" }]}
                  >
                    <Select
                      placeholder="Selecione o empreedimento"
                      showSearch
                      allowClear
                      size="large"
                      filterOption={filterOption}
                      optionFilterProp="children"
                      options={mockEmpreendimento}
                      onChange={(value, option) =>
                        handleChangeEmpreendimento(value, option)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Semente:"
                    name="semente"
                    rules={[{ required: true, message: "Campo obrigatório" }]}
                  >
                    <Input size="large" placeholder="Semente loteria federal" />
                  </Form.Item>

                  {/* <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  style={{ marginTop: "20px", backgroundColor: "#F07620" }}
                >
                  Iniciar Sorteio
                </Button> */}
                </GridSelected>
              </Form>

              <div style={{ width: "100%" }}>
                <Grid>
                  {cards?.map((item: any) => (
                    <SelectableCard
                      key={item.key}
                      $selected={selected === item.key}
                      onClick={() => setSelected(item.key)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: "10px",
                          padding: "20px",
                        }}
                      >
                        <span
                          style={{ fontFamily: "Inter", fontWeight: "400" }}
                        >
                          {item.label}
                        </span>
                        <Divider style={{ margin: "5px 0px" }} />
                        <span
                          style={{
                            fontFamily: "Inter",
                            fontWeight: "bold",
                            fontSize: "20px",
                          }}
                        >
                          {item.value}
                        </span>
                      </div>
                    </SelectableCard>
                  ))}
                </Grid>
              </div>

              <>
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
                    Iniciar sorteio {selected}
                  </div>
                </ButtonSolicitation>
              </>

              <div
                style={{
                  borderRadius: "20px",
                  marginBottom: "3px",
                  width: "100%",
                }}
              >
                {listaSelecionada.length > 0 && (
                  <List
                    style={{ marginTop: 24, background: "white" }}
                    bordered
                    dataSource={listaSelecionada}
                    renderItem={(item: any) => (
                      <List.Item>
                        <strong>{item!?.nome}</strong> — {item!?.cpf}
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </>
          ) : (
            <></>
          )}

          <ModalSorteio
            isOpen={openSolicitationModal}
            handleClose={() => setOpenSolicitationModal(false)}
          />
        </>
      </div>
    </Container>
  );
};

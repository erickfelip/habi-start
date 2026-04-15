import {
  Modal,
  Divider,
  Input,
  Form,
  Button,
  notification,
  Select,
} from "antd";
import { useState } from "react";
import { Grid, SelectableCard } from "./styles";

interface IOrderModalDetails {
  isOpen: boolean;
  handleClose: () => void;
  orderData?: any;
}

export const ModalSorteio = ({ isOpen, handleClose }: IOrderModalDetails) => {
  // const queryClient = useQueryClient();
  const [form] = Form.useForm();
  // selecionar o empreendimento

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
    handleClose();

    // await createMunicipio(payload)
    //   .then(() => {
    //     form.resetFields();
    //     notification.success({
    //       duration: 3,
    //       message: "Sucesso!",
    //       description: `Novo município cadastrado.`,
    //     });
    //     queryClient.invalidateQueries({
    //       queryKey: ["GET_MUNICIPIOS"],
    //     });
    //     handleClose();
    //   })
    //   .catch((error) => {
    //     notification.error({
    //       duration: 1,
    //       message: "Erro!",
    //       description: `${error?.response?.data?.message}`,
    //     });
    //   });
  };

  const mockEmpreendimento = [
    {
      label: "Henrique paiva",
      value: "a9b52b4a-d11a-4785-bf85-01335fb4542d",
      p_idosos: 3,
      p_vulnerabilidade: 50,
      p_pcd: 3,
      qtd: 240,
    },
    {
      label: "Maria Belo",
      value: "ad8ace56-4ac9-4fc8-8691-bf430002f3d9 ",
      p_idosos: 3,
      p_vulnerabilidade: 50,
      p_pcd: 3,
      qtd: 240,
    },
  ];

  const filterOption = (input: any, option: any) => {
    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  //   const [cards, setCards] = useState({
  //     idosos: 0,
  //     vulnerabilidade: 0,
  //     pcd: 0,
  //     ampla: 0,
  //     qtd: 0,
  //   });
  const [selected, setSelected] = useState(null);

  const [cards, setCards] = useState<any>([
    { key: "idosos", label: "Idosos (3%)", value: 0 },
    { key: "vulnerabilidade", label: "Vulnerabilidade (50%)", value: 0 },
    { key: "pcd", label: "PCD (3%)", value: 0 },
    { key: "ampla", label: "Ampla Concorrência (44%)", value: 0 },
  ]);

  const handleChangeEmpreendimento = (_value: any, option: any) => {
    const { p_idosos, p_vulnerabilidade, p_pcd, qtd } = option;

    const calc = (percent: any) => Math.round((percent / 100) * qtd);

    const idosos = calc(p_idosos);
    const vulnerabilidade = calc(p_vulnerabilidade);
    const pcd = calc(p_pcd);
    const ampla = qtd - (idosos + vulnerabilidade + pcd); // resto

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

  return (
    <Modal
      title={<h3 style={{ fontFamily: "Inter" }}>Criação de sorteio</h3>}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closeIcon={true}
      width="75%"
    >
      <Divider />

      <Form layout="vertical" form={form} onFinish={onFinish}>
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

        <>
          <Grid>
            {cards?.map((item: any) => (
              <SelectableCard
                key={item.key}
                $selected={selected === item.key}
                onClick={() => setSelected(item.key)}
              >
                <h3>{item.label}</h3>
                <h2>{item.value}</h2>
              </SelectableCard>
            ))}
          </Grid>
        </>

        {/* <Form.Item
          label="Classificação empreendimento:"
          name="classificacao"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Select
            placeholder="Selecione a classificação"
            showSearch
            allowClear
            size="large"
            filterOption={filterOption}
            optionFilterProp="children"
            options={faixas}
          />
        </Form.Item> */}

        <Divider style={{ margin: "10px 0px" }} />
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          style={{ marginTop: "20px", backgroundColor: "#F07620" }}
        >
          Iniciar Sorteio
        </Button>
      </Form>
    </Modal>
  );
};

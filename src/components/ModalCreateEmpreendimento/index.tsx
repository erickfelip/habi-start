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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmpreendimento,
  getFaixas,
  getMunicipios,
} from "../../services/sga.requests";
import { Grid } from "./styles";

interface IOrderModalDetails {
  isOpen: boolean;
  handleClose: () => void;
  orderData?: any;
}

export const ModalCreateEmpreendimento = ({
  isOpen,
  handleClose,
}: IOrderModalDetails) => {
  const { data: faixas = [] } = useQuery({
    queryKey: ["GET_FAIXAS"],
    queryFn: async () => {
      const response = await getFaixas();
      return response!?.rows;
    },
    retry: true,
    refetchOnWindowFocus: false,
    enabled: isOpen ? true : false,
  });

  const { data: municipios = [], isLoading } = useQuery({
    queryKey: ["GET_MUNICIPIOS"],
    queryFn: async () => {
      const response = await getMunicipios();
      return response;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [faixaLabel, setFaixaLabel] = useState<string>("");

  const onFinish = async (values: any) => {
    const valorInt = parseInt(values.faixa, 10);

    const payload = {
      idMunicipio: values!?.idMunicipio,
      faixaNome: faixaLabel,
      faixaValor: valorInt,
      label: values.nome,
      qtd: Number(values.qtd),
      pVulnerabilidade: Number(values.p_vulnerabilidade), // cotas para sorteio
      pIdosos: Number(values.p_idosos), // cotas para sorteio
      pPcd: Number(values.p_pcd), // cotas para sorteio
      pAmplaConcorrencia: Number(values.p_ampla_concorrencia), // cotas para sorteio
    };

    await createEmpreendimento(payload)
      .then(() => {
        setFaixaLabel("");
        form.resetFields();
        notification.success({
          duration: 3,
          message: "Sucesso!",
          description: `Novo empreendimento cadastrado.`,
        });
        queryClient.invalidateQueries({
          queryKey: ["GET_EMPREENDIMENTOS"],
        });
        handleClose();
      })
      .catch((error) => {
        notification.error({
          duration: 1,
          message: "Erro!",
          description: `${error?.response?.data?.message}`,
        });
      });
  };

  const filterOption = (input: any, option: any) => {
    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const handleChange = (_: any, option: any) => {
    setFaixaLabel(option?.label);
  };

  return (
    <Modal
      title={<h3 style={{ fontFamily: "Inter" }}>Adicionar empreendimento</h3>}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closeIcon={true}
      width="75%"
    >
      <Divider />

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Município:"
          name="idMunicipio"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Select
            placeholder="Selecione o municipio do usuario"
            showSearch
            allowClear
            size="large"
            filterOption={filterOption}
            optionFilterProp="children"
            loading={isLoading}
            options={municipios!?.map((muni: { id: string; nome: string }) => {
              return {
                value: muni?.id,
                label: muni?.nome,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          label="Nome do empreendimento:"
          name="nome"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Input size="large" placeholder="Nome do municipio" />
        </Form.Item>

        <Form.Item
          label="Quantidade de apartamentos:"
          name="qtd"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Input size="large" placeholder="qtd" type="number" min={1} />
        </Form.Item>

        <Form.Item
          label="Classificação empreendimento:"
          name="faixa"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Select
            placeholder="Selecione a classificação"
            showSearch
            allowClear
            size="large"
            filterOption={filterOption}
            optionFilterProp="children"
            options={faixas!?.map((faixa: any) => {
              return {
                label: faixa?.nome,
                value: faixa?.valorReais,
                option: faixa,
              };
            })}
            onChange={(_, option) => handleChange(_, option)}
          />
        </Form.Item>

        <Grid>
          <Form.Item
            label="Famílias em vulnerabilidade (%):"
            name="p_vulnerabilidade"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input size="large" placeholder="%" type="number" min={1} />
          </Form.Item>

          <Form.Item
            label="Idosos (%):"
            name="p_idosos"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input size="large" placeholder="%" type="number" min={1} />
          </Form.Item>

          <Form.Item
            label="PCD (%):"
            name="p_pcd"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input size="large" placeholder="%" type="number" min={1} />
          </Form.Item>

          {/* // resto das porcentagens especificadas */}
          <Form.Item
            label="Ampla concorrência(%):"
            name="p_ampla_concorrencia"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input size="large" placeholder="%" type="number" min={1} />
          </Form.Item>
        </Grid>

        <Divider style={{ margin: "10px 0px" }} />
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          style={{ marginTop: "20px", backgroundColor: "#F07620" }}
        >
          Cadastrar
        </Button>
      </Form>
    </Modal>
  );
};

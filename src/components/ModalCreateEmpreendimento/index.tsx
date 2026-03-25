import {
  Modal,
  Divider,
  Input,
  Form,
  Button,
  notification,
  Select,
} from "antd";
import { UserDeleteOutlined } from "@ant-design/icons";

import { useState } from "react";

import { IoAlert } from "react-icons/io5";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TiDeleteOutline } from "react-icons/ti";
import moment from "moment";
import { createMunicipio } from "../../services/sga.requests";
import { Grid } from "./styles";

interface IOrderModalDetails {
  isOpen: boolean;
  handleClose: () => void;
  orderData?: any;
}

export const ModalCreateEmpreendimento = ({
  isOpen,
  handleClose,
  orderData,
}: IOrderModalDetails) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const payload = {
      nome: values.nome,
      qtd: values.qtd,
      classificacao: values.classificacao,
      p_vulnerabilidade: values.p_vulnerabilidade, // cotas para sorteio
      p_idosos: values.p_idosos, // cotas para sorteio
      p_pcd: values.p_pcd, // cotas para sorteio
      p_area_risco: values.p_area_risco, // cotas para sorteio
      // SUPLENTES SÃO 30% DO TOTAL DE VAGAS DE APARTAMENTOS - VALOR FIXO API
    };
    console.log("@empreendimento cadastrado", { payload });
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

  const faixas = [
    { label: "Faixa 1", value: "faixa_1" },
    { label: "Faixa 2", value: "faixa_2" },
    { label: "Faixa 3", value: "faixa_3" },
  ];

  const filterOption = (input: any, option: any) => {
    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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

          <Form.Item
            label="Área de risco (%):"
            name="p_area_risco"
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

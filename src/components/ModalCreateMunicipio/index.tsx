import { Modal, Divider, Input, Form, Button, notification } from "antd";
import { UserDeleteOutlined } from "@ant-design/icons";

import { useState } from "react";

import { IoAlert } from "react-icons/io5";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TiDeleteOutline } from "react-icons/ti";
import moment from "moment";
import { createMunicipio } from "../../services/sga.requests";

interface IOrderModalDetails {
  isOpen: boolean;
  handleClose: () => void;
  orderData?: any;
}

export const ModalCreateMunicipio = ({
  isOpen,
  handleClose,
  orderData,
}: IOrderModalDetails) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const payload = {
      nome: values.nome,
    };
    await createMunicipio(payload)
      .then(() => {
        form.resetFields();
        notification.success({
          duration: 3,
          message: "Sucesso!",
          description: `Novo município cadastrado.`,
        });
        queryClient.invalidateQueries({
          queryKey: ["GET_MUNICIPIOS"],
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

  return (
    <Modal
      title={<h3 style={{ fontFamily: "Inter" }}>Adicionar município</h3>}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closeIcon={true}
      width="65%"
    >
      <Divider />

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Nome do Município:"
          name="nome"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Input size="large" placeholder="Nome do municipio" />
        </Form.Item>
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

import {
  Modal,
  Divider,
  Input,
  Form,
  Button,
  notification,
  Select,
} from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getMunicipios } from "../../services/sga.requests";
import { GridName } from "./styles";

interface IOrderModalDetails {
  isOpen: boolean;
  handleClose: () => void;
}

export const ModalCreateUser = ({
  isOpen,
  handleClose,
}: IOrderModalDetails) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  
  const { data: municipios = [], isLoading } = useQuery({
    queryKey: ["GET_MUNICIPIOS"],
    queryFn: async () => {
      const response = await getMunicipios();
      return response;
    },
    retry: true,
    refetchOnWindowFocus: false,
  });

  const onFinish = async (values: {
    primeiroNome: string;
    segundoNome: string;
    cargo: string;
    idMunicipio: string;
    email: string;
    senha: string;
  }) => {
    await createUser(values)
      .then(() => {
        form.resetFields();
        notification.success({
          duration: 3,
          message: "Sucesso!",
          description: `Novo município cadastrado.`,
        });
        queryClient.invalidateQueries({
          queryKey: ["GET_USUARIOS"],
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

  const roles = [
    { label: "Coordenador", value: "COORDENADOR" },
    { label: "Administrador", value: "ADMIN" },
    { label: "Geral", value: "GERAL" },
  ];

  return (
    <Modal
      title={<h3 style={{ fontFamily: "Inter" }}>Cadastrar usuário</h3>}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closeIcon={true}
      width="65%"
    >
      <Divider />

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <GridName>
          <Form.Item
            label="Nome:"
            name="primeiroNome"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input size="large" placeholder="Informe o nome do usuario" />
          </Form.Item>
          <Form.Item
            label="Sobrenome:"
            name="segundoNome"
            rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input size="large" placeholder="Informe o sobrenome do usuario" />
          </Form.Item>
        </GridName>

        <Form.Item
          label="E-mail:"
          name="email"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Input
            size="large"
            placeholder="Informe o e-mail do usuário"
            type={"email"}
          />
        </Form.Item>
        <Form.Item
          label="Senha:"
          name="senha"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Input size="large" placeholder="Informe a senha do usuário" />
        </Form.Item>
        <Form.Item
          label="Cargo:"
          name="cargo"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Select
            placeholder="Selecione o cargo do usuario"
            showSearch
            allowClear
            size="large"
            filterOption={filterOption}
            optionFilterProp="children"
            options={roles}
          />
        </Form.Item>
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

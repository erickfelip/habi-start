import { Modal, Divider, Input, Form, Button, notification } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { updateBeneficiario } from "../../services/sga.requests";
import { formatDate } from "../../utils";
import moment from "moment";

interface IOrderModalDetails {
  isOpen: boolean;
  handleClose: () => void;
  userData?: any;
}

export const ModalUpdateDataNascimento = ({
  isOpen,
  handleClose,
  userData,
}: IOrderModalDetails) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const payload = {
      dataNascimento: moment(values!?.dataNascimento, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      ),
    };

    await updateBeneficiario({ idUser: userData!?.id, payload: payload })
      .then(() => {
        form.resetFields();
        notification.success({
          duration: 3,
          message: "Sucesso!",
          description: `Data de nascimento atualizada.`,
        });
        queryClient.invalidateQueries({
          queryKey: ["GET_BENEFICIARIOS"],
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
      title={<h3 style={{ fontFamily: "Inter" }}>Atualização Beneficiário</h3>}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closeIcon={true}
      width="65%"
    >
      <Divider />

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="dataNascimento" label="Data de Nascimento">
          <Input
            size="large"
            placeholder="DD/MM/YYYY"
            onChange={(e) => {
              form.setFieldsValue({
                dataNascimento: formatDate(e.target.value),
              });
            }}
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
          Atualizar
        </Button>
      </Form>
    </Modal>
  );
};

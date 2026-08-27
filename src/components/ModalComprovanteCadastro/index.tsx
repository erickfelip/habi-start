import { Modal, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getMunicipios } from "../../services/sga.requests";
import moment from "moment";

import { CheckCircleFilled } from "@ant-design/icons";

interface IOrderModalDetails {
  isOpen: boolean;
  handleClose: () => void;
  userData?: any;
}

const { Text } = Typography;

export const ModalComprovanteCadastro = ({
  isOpen,
  handleClose,
  userData,
}: IOrderModalDetails) => {
  const { data: municipios = [], isLoading: _loadingMunicipios } = useQuery({
    queryKey: ["GET_MUNICIPIOS"],
    queryFn: async () => {
      const response = await getMunicipios();
      return response;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  const municipioSelecionado = municipios.find(
    (item: { id: string; nome: string }) => item.id === userData.idMunicipio
  );

  const label = municipioSelecionado?.nome ?? "Município não identificado";

  return (
    <Modal
      //   title={<h3 style={{ fontFamily: "Inter" }}>Comprovante de Cadastro</h3>}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closeIcon={true}
      width="35%"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <CheckCircleFilled style={{ fontSize: 22, color: "#52c41a" }} />
        <div>
          <Text strong style={{ fontSize: "16px" }}>
            Comprovante cadastrado
          </Text>
          <div>
            <Text type="secondary">Registro concluído com sucesso</Text>
          </div>
        </div>
      </div>
      <div style={{ margin: "16px 0", borderTop: "1px solid #f0f0f0" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0",
        }}
      >
        <Text type="secondary" style={{ fontSize: 14 }}>
          Código
        </Text>
        <div>
          {" "}
          {userData.codigo ??
            "Código indisponível — cadastro realizado fora do portal."}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0",
        }}
      >
        <Text type="secondary" style={{ fontSize: 14 }}>
          Data/Hora
        </Text>
        <div> {moment(userData.createdAt).format("DD/MM/YYYY [às] HH:mm")}</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0",
        }}
      >
        <Text type="secondary" style={{ fontSize: 14 }}>
          Município
        </Text>
        <div> {label}</div>
      </div>
    </Modal>
  );
};

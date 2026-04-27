import {
  Modal,
  Divider,
  Input,
  Button,
  notification,
  Table,
  Pagination,
  Dropdown,
  Badge,
  Tag,
  Popover,
  Space,
} from "antd";
import { MdOutlineFilterList } from "react-icons/md";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createIndicacaoDireta,
  getBeneficiarios,
} from "../../services/sga.requests";
import { Label, SubLabel } from "./styles";
import useDebounce from "../../hooks/useDebounce";

interface IOrderModalDetails {
  isOpen: boolean;
  handleClose: () => void;
  orderData?: any;
}

export const ModalIndicacaoDireta = ({
  isOpen,
  handleClose,
  orderData,
}: IOrderModalDetails) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("nome");
  const [param, setParam] = useState("");
  const debouncedValue = useDebounce(param, 500);

  const { data: beneficiarios = [], isLoading: isLoadingBeneficiarios } =
    useQuery({
      queryKey: ["GET_BENEFICIARIOS", page, filter, debouncedValue],
      queryFn: async () => {
        const response = await getBeneficiarios({
          page: page - 1,
          limit: 10,
          filter: filter,
          param: param,
        });
        return response;
      },
      retry: true,
      refetchOnWindowFocus: true,
    });

  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [motivos, setMotivos] = useState<any>({}); // { [userId]: motivo }
  const [selectedUsers, setSelectedUsers] = useState<any>([]);

  const rowSelection = {
    selectedRowKeys,

    onChange: (newSelectedRowKeys: any, selectedRows: any) => {
      setSelectedRowKeys((prevKeys: any) => {
        const newKeysSet = new Set(newSelectedRowKeys);
        const prevKeysSet = new Set(prevKeys);

        const currentPageIds = beneficiarios!?.rows!?.map(
          (item: any) => item.id
        );

        currentPageIds.forEach((id: any) => {
          if (!newKeysSet.has(id)) {
            prevKeysSet.delete(id);
          }
        });

        newSelectedRowKeys.forEach((id: any) => {
          prevKeysSet.add(id);
        });

        return Array.from(prevKeysSet);
      });

      setSelectedUsers((prev: any) => {
        const map = new Map(prev.map((u: any) => [u.id, u]));

        selectedRows.forEach((row: any) => {
          map.set(row.id, { id: row.id, nome: row.nome });
        });

        beneficiarios!?.rows!?.forEach((item: any) => {
          if (!newSelectedRowKeys.includes(item.id)) {
            map.delete(item.id);
          }
        });

        return Array.from(map.values());
      });
    },
  };

  const handleRemoveUser = (id: string) => {
    setSelectedRowKeys((prev: any) => prev.filter((key: any) => key !== id));
    setSelectedUsers((prev: any) => prev.filter((user: any) => user.id !== id));
  };

  const handleMotivoChange = (value: any, id: string) => {
    setMotivos((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      key: "cpf",
    },
    {
      title: "Justificativa de indicação direta",
      key: "motivo",
      render: (_: any, record: any) => (
        <Input
          placeholder="Informe o motivo da indicação direta."
          value={motivos[record.id] || ""}
          onChange={(e) => handleMotivoChange(e.target.value, record!?.id)}
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      await Promise.all(
        selectedRowKeys!?.map(async (id: any) => {
          const payload = {
            idEmpreendimento: orderData!?.id,
            idBeneficiario: id,
            motivo: motivos[id] || "",
          };
          return createIndicacaoDireta(payload).then((_res) => {
            setSelectedUsers([]);
            setSelectedRowKeys([]);
            setMotivos({});
            handleClose();
          });
        })
      );
      notification.success({
        duration: 3,
        message: "Sucesso!",
        description: `Indicação direta realizada.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["GET_EMPREENDIMENTOS"],
      });
    } catch (err: any) {
      notification.error({
        duration: 1,
        message: "Erro!",
        description: `${err?.response?.data?.message}`,
      });
    }
  };

  return (
    <Modal
      title={
        <div>
          <Label>Indicação direta </Label>
          <SubLabel>| {orderData!?.label}</SubLabel>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      closeIcon={true}
      width="75%"
      onOk={handleSubmit}
      okText="Cadastrar indicação direta"
      cancelText="Fechar"
    >
      <Divider />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          flexDirection: "row",
          paddingBottom: "20px",
          gap: "8px",
          marginTop: "20px",
        }}
      >
        <Input
          placeholder={`Informe o ${filter} do beneficiário`}
          allowClear
          size="large"
          onChange={(e) => setParam(e.target.value)}
          value={param}
          style={{ width: "500px", borderRadius: "20px" }}
        />

        <Dropdown
          arrow={{ pointAtCenter: true }}
          menu={{
            selectedKeys: [filter],
            onClick: (e) => setFilter(e.key),
            items: [
              {
                key: "nome",
                label: "Nome do beneficiário",
              },
              {
                key: "cpf",
                label: "CPF",
              },
            ],
          }}
        >
          <MdOutlineFilterList
            style={{ cursor: "pointer" }}
            size={"33px"}
            color="#626262"
          />
        </Dropdown>

        <div>
          <Popover
            title="Pessoas selecionadas"
            content={
              <Space direction="vertical">
                {selectedUsers!?.length === 0 && <span>Nenhuma pessoa</span>}

                {selectedUsers!?.map((user: any) => (
                  <Space key={user.id}>
                    <span>{user.nome}</span>
                    <Button
                      size="small"
                      danger
                      onClick={() => handleRemoveUser(user!?.id)}
                    >
                      Remover
                    </Button>
                  </Space>
                ))}
              </Space>
            }
            trigger="hover"
          >
            <Badge count={selectedRowKeys.length} showZero>
              <Tag color="blue" style={{ cursor: "pointer" }}>
                Selecionados
              </Tag>
            </Badge>
          </Popover>
        </div>
      </div>

      <Table
        rowKey={(record) => record!?.id}
        loading={isLoadingBeneficiarios}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={beneficiarios!?.rows}
        pagination={false}
      />
      <Pagination
        current={page}
        onChange={(value: React.SetStateAction<number>) => setPage(value)}
        total={
          beneficiarios!?.count ? Math.ceil(beneficiarios!?.count / 10) * 10 : 1
        }
        style={{ alignSelf: "center", marginTop: "10px" }}
        showSizeChanger={false}
      />
    </Modal>
  );
};

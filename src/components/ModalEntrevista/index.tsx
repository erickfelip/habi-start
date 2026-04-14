import {
  Modal,
  Divider,
  Input,
  Form,
  Button,
  //   notification,
  Select,
  Radio,
} from "antd";
import { BsFiletypePdf } from "react-icons/bs";

import { Grid, Grid3x3 } from "./styles";
import {
  deficiencias,
  formatDate,
  grauInstrucao,
  maskCnpj,
  maskCpf,
  maskCurrencyBRL,
} from "../../utils";
import PdfFormFiller from "../PdfFormFillter.tsx";
import { useEffect, useState } from "react";

interface IOrderModalDetails {
  isOpen: boolean;
  handleClose: () => void;
  userData?: any;
}

export const ModalEntrevista = ({
  isOpen,
  handleClose,
  userData,
}: IOrderModalDetails) => {
  // const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [dadosPreenchidos, setDadosPreenchidos] = useState({});
  const [callFormFiller, setCallFormFiller] = useState<boolean>(false);
  // selecionar o empreendimento
  console.log({ form });
  console.log({ dadosPreenchidos });

  useEffect(() => {
    if (!isOpen) setCallFormFiller(false);
  }, [isOpen]);

  const onFinish = async (values: any) => {
    setDadosPreenchidos(values);
    console.log({ values });

    // const payload = {
    //   empreendimento: values.empreendimento,
    //   qtd: values.qtd,
    //   classificacao: values.classificacao,
    // };

    // form.resetFields();
    // notification.success({
    //   duration: 3,
    //   message: "Sucesso!",
    //   description: `Novo empreendimento cadastrado.`,
    // });
    // handleClose();

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

  const filterOption = (input: any, option: any) => {
    return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const handleCpfChange = (e: any) => {
    const masked = maskCpf(e.target.value);
    form.setFieldValue("cpfFontePagadora", masked);
  };

  const handleCpfFonteConjugeChange = (e: any) => {
    const masked = maskCpf(e.target.value);
    form.setFieldValue("cpfFontePagadoraConjuge", masked);
  };

  const handleCpfTutorChange = (e: any) => {
    const masked = maskCpf(e.target.value);
    form.setFieldValue("cpfTutor", masked);
  };

  const handleCpfTutorConjugeChange = (e: any) => {
    const masked = maskCpf(e.target.value);
    form.setFieldValue("cpfTutorConjuge", masked);
  };

  const handleCnpjChange = (e: any) => {
    const masked = maskCnpj(e.target.value);
    form.setFieldValue("cnpjFontePagadora", masked);
  };

  const handleCnpjConjugeChange = (e: any) => {
    const masked = maskCnpj(e.target.value);
    form.setFieldValue("cnpjFontePagadoraConjuge", masked);
  };

  const handleCpfConjugeChange = (e: any) => {
    const masked = maskCpf(e.target.value);
    form.setFieldValue("cpfConjuge", masked);
  };

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontFamily: "Inter", marginRight: "5px" }}>
            Declaração de Beneficiário
          </h3>
          <h3 style={{ fontFamily: "Inter", fontWeight: "300" }}>
            {" "}
            | {userData!?.nome}
          </h3>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      closeIcon={true}
      width="75%"
    >
      <Divider />

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Grid>
          <Form.Item
            label="Conjuge ausente:"
            name="conjugeAusente"
            // rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Radio.Group size="large">
              <Radio value={true}>Sim</Radio>
              <Radio value={false}>Não</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Grau de Instrução:"
            name="grauInstrucao"
            // rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Select
              placeholder="Selecione o grau de instrução"
              showSearch
              allowClear
              size="large"
              filterOption={filterOption}
              optionFilterProp="children"
              options={grauInstrucao}
            />
          </Form.Item>
        </Grid>

        <Divider>Renda Comprovada</Divider>
        <Grid3x3>
          <Form.Item
            name="cpfFontePagadora"
            label="CPF Fonte pagadora:"
            // rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input
              size="large"
              onChange={handleCpfChange}
              maxLength={14}
              placeholder="000.000.000-00"
            />
          </Form.Item>

          <Form.Item
            name="cnpjFontePagadora"
            label="CNPJ Fonte pagadora:"
            // rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Input
              size="large"
              onChange={handleCnpjChange}
              maxLength={18}
              placeholder="00.000.000/0000-00"
            />
          </Form.Item>

          <Form.Item name="dataAdmissao" label="Data de Admissão" required>
            <Input
              size="large"
              placeholder="DD/MM/YYYY"
              onChange={(e) => {
                form.setFieldsValue({
                  dataAdmissao: formatDate(e.target.value),
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="valorRendaBrutaComprovada"
            label="Valor da Renda Bruta"
            required
          >
            <Input
              size="large"
              inputMode="numeric"
              placeholder="0,00"
              value={form.getFieldValue("valorRendaBrutaComprovada")}
              onChange={(e) => {
                form.setFieldsValue({
                  valorRendaBrutaComprovada: maskCurrencyBRL(e.target.value),
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="valorRendaLiquidaComprovada"
            label="Valor da Renda Líquida"
            required
          >
            <Input
              size="large"
              inputMode="numeric"
              placeholder="0,00"
              value={form.getFieldValue("valorRendaLiquidaComprovada")}
              onChange={(e) => {
                form.setFieldsValue({
                  valorRendaLiquidaComprovada: maskCurrencyBRL(e.target.value),
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="mesReferenciaRendaComprovada"
            label="Mês de Referência da Renda"
            required
          >
            <Input size="large" />
          </Form.Item>
        </Grid3x3>

        <Divider>Renda Declarada</Divider>

        <Grid3x3>
          <Form.Item
            name="dataInicioRendaDeclarada"
            label="Data Início da Renda"
            required
          >
            <Input
              size="large"
              placeholder="DD/MM/YYYY"
              onChange={(e) => {
                form.setFieldsValue({
                  dataInicioRendaDeclarada: formatDate(e.target.value),
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="valorRendaLiquidaDeclarada"
            label="Valor da Renda Líquida"
            required
          >
            <Input
              size="large"
              inputMode="numeric"
              placeholder="0,00"
              value={form.getFieldValue("valorRendaLiquidaDeclarada")}
              onChange={(e) => {
                form.setFieldsValue({
                  valorRendaLiquidaDeclarada: maskCurrencyBRL(e.target.value),
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="mesReferenciaRendaDeclarada"
            label="Mês de Referência da Renda"
            required
          >
            <Input size="large" />
          </Form.Item>
        </Grid3x3>

        <Divider>Benefícios</Divider>

        <Grid>
          <Form.Item
            label="Recebe BPC - Benefício de Prestação Continuada:"
            name="recebeBpc"
            // rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Radio.Group size="large">
              <Radio value={true}>Sim</Radio>
              <Radio value={false}>Não</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Recebe Bolsa família:"
            name="bolsa"
            // rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Radio.Group size="large">
              <Radio value={true}>Sim</Radio>
              <Radio value={false}>Não</Radio>
            </Radio.Group>
          </Form.Item>
        </Grid>

        <Divider>Menor assistido</Divider>

        <>
          <Form.Item
            label="Preencher se menor de 18 anos:"
            name="menorDe18anos"
            // rules={[{ required: true, message: "Campo obrigatório" }]}
          >
            <Radio.Group size="large">
              <Radio value={true}>Menor emancipado</Radio>
              <Radio value={false}>Menor assistido</Radio>
            </Radio.Group>
          </Form.Item>

          <Grid>
            <Form.Item
              name="cpfTutor"
              label="CPF Tutor:"
              rules={[{ required: false }]}
            >
              <Input
                size="large"
                onChange={handleCpfTutorChange}
                maxLength={14}
                placeholder="000.000.000-00"
              />
            </Form.Item>

            <Form.Item
              name="nomeTutor"
              label="Nome Tutor"
              rules={[{ required: false }]}
            >
              <Input size="large" />
            </Form.Item>
          </Grid>
        </>

        <Divider>Dados Pessoais Cônjuge</Divider>

        <>
          <Form.Item
            name="nomeConjuge"
            label="Nome cônjuge"
            rules={[{ required: false }]}
          >
            <Input size="large" />
          </Form.Item>
          <Grid3x3>
            <Form.Item
              name="cpfConjuge"
              label="CPF"
              rules={[{ required: false }]}
            >
              <Input
                placeholder="000.000.000-00"
                onChange={handleCpfConjugeChange}
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="profissaoConjuge"
              label="Profissão"
              rules={[{ required: false }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Grau de Instrução:"
              name="grauInstrucaoConjuge"
              // rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Select
                placeholder="Selecione o grau de instrução"
                showSearch
                allowClear
                size="large"
                filterOption={filterOption}
                optionFilterProp="children"
                options={grauInstrucao}
              />
            </Form.Item>
          </Grid3x3>
          <Grid3x3>
            <Form.Item
              name="cpfFontePagadoraConjuge"
              label="CPF Fonte pagadora:"
            >
              <Input
                size="large"
                onChange={handleCpfFonteConjugeChange}
                maxLength={14}
                placeholder="000.000.000-00"
              />
            </Form.Item>

            <Form.Item
              name="cnpjFontePagadoraConjuge"
              label="CNPJ Fonte pagadora:"
            >
              <Input
                size="large"
                onChange={handleCnpjConjugeChange}
                maxLength={18}
                placeholder="00.000.000/0000-00"
              />
            </Form.Item>

            <Form.Item
              name="dataAdmissaoConjuge"
              label="Data de Admissão"
              rules={[{ required: false }]}
            >
              <Input
                size="large"
                placeholder="DD/MM/YYYY"
                onChange={(e) => {
                  form.setFieldsValue({
                    dataAdmissaoConjuge: formatDate(e.target.value),
                  });
                }}
              />
            </Form.Item>

            <Form.Item
              name="valorRendaBrutaComprovadaConjuge"
              label="Valor da Renda Bruta Comprovada"
              rules={[{ required: false }]}
            >
              <Input
                size="large"
                inputMode="numeric"
                placeholder="0,00"
                value={form.getFieldValue("valorRendaBrutaComprovadaConjuge")}
                onChange={(e) => {
                  form.setFieldsValue({
                    valorRendaBrutaComprovadaConjuge: maskCurrencyBRL(
                      e.target.value
                    ),
                  });
                }}
              />
            </Form.Item>

            <Form.Item
              name="valorRendaLiquidaComprovadaConjuge"
              label="Valor da Renda Líquida Comprovada"
              rules={[{ required: false }]}
            >
              <Input
                size="large"
                inputMode="numeric"
                placeholder="0,00"
                value={form.getFieldValue("valorRendaLiquidaComprovadaConjuge")}
                onChange={(e) => {
                  form.setFieldsValue({
                    valorRendaLiquidaComprovadaConjuge: maskCurrencyBRL(
                      e.target.value
                    ),
                  });
                }}
              />
            </Form.Item>

            <Form.Item
              name="mesReferenciaRendaComprovadaConjuge"
              label="Mês de Referência da Renda Comprovada"
              rules={[{ required: false }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="dataInicioRendaDeclaradaConjuge"
              label="Data Início da Renda Declarada"
              rules={[{ required: false }]}
            >
              <Input
                size="large"
                placeholder="DD/MM/YYYY"
                onChange={(e) => {
                  form.setFieldsValue({
                    dataInicioRendaDeclaradaConjuge: formatDate(e.target.value),
                  });
                }}
              />
            </Form.Item>

            <Form.Item
              name="valorRendaLiquidaDeclaradaConjuge"
              label="Valor da Renda Líquida Declarada"
              rules={[{ required: false }]}
            >
              <Input
                size="large"
                inputMode="numeric"
                placeholder="0,00"
                value={form.getFieldValue("valorRendaLiquidaDeclaradaConjuge")}
                onChange={(e) => {
                  form.setFieldsValue({
                    valorRendaLiquidaDeclaradaConjuge: maskCurrencyBRL(
                      e.target.value
                    ),
                  });
                }}
              />
            </Form.Item>

            <Form.Item
              name="mesReferenciaRendaDeclaradaConjuge"
              label="Mês de Referência da Renda Declarada"
              rules={[{ required: false }]}
            >
              <Input size="large" />
            </Form.Item>
          </Grid3x3>
          <Grid3x3>
            <Form.Item
              label="Recebe BPC - Benefício de Prestação Continuada:"
              name="recebeBpcConjuge"
              // rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Radio.Group size="large">
                <Radio value={true}>Sim</Radio>
                <Radio value={false}>Não</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Recebe Bolsa família:"
              name="recebeBolsaConjuge"
              // rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Radio.Group size="large">
                <Radio value={true}>Sim</Radio>
                <Radio value={false}>Não</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Preencher se menor de 18 anos:"
              name="menorDe18anosConjuge"
              // rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Radio.Group size="large">
                <Radio value={true}>Menor emancipado</Radio>
                <Radio value={false}>Menor assistido</Radio>
              </Radio.Group>
            </Form.Item>
          </Grid3x3>
          <>
            <Grid>
              <Form.Item
                name="cpfTutorConjuge"
                label="CPF Tutor:"
                rules={[{ required: false }]}
              >
                <Input
                  size="large"
                  onChange={handleCpfTutorConjugeChange}
                  maxLength={14}
                  placeholder="000.000.000-00"
                />
              </Form.Item>

              <Form.Item name="nomeTutorConjuge" label="Nome Tutor">
                <Input size="large" />
              </Form.Item>
            </Grid>
          </>
          <Divider>Pessoa com deficiência no grupo familiar</Divider>

          <Grid>
            <Form.Item
              name="nomeDaPessoaComDeficiencia"
              label="Nome da pessoa com deficiencia"
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="cidPessoaComDeficiencia"
              label="CID (Classificação Internacional de Doenças)"
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="nomeDaPessoaComMicrocefalia"
              label="Nome da pessoa com microcefalia"
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="cidPessoaComMicrocefalia"
              label="CID (Classificação Internacional de Doenças)"
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Será necessário promover adequação no imóvel pretendido?"
              name="adequacaoImovelPretendido"
              // rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Radio.Group size="large">
                <Radio value={true}>Sim</Radio>
                <Radio value={false}>Não</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Para qual deficiência?"
              name="discriminacaoDeficiencia"
              // rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Select
                placeholder="Selecione a deficiência"
                showSearch
                allowClear
                size="large"
                filterOption={filterOption}
                optionFilterProp="children"
                options={deficiencias}
              />
            </Form.Item>

            <Form.Item
              label="Família em situação de rua e/ou com trajetória de rua?"
              name="familiaEmSituacaoDeRua"
              // rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Radio.Group size="large">
                <Radio value={true}>Sim</Radio>
                <Radio value={false}>Não</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Família integra o déficit habitacional local?"
              name="familiaIntegraDeficitHabitacional"
              // rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Radio.Group size="large">
                <Radio value={true}>Sim</Radio>
                <Radio value={false}>Não</Radio>
              </Radio.Group>
            </Form.Item>
          </Grid>

          <Divider>Declarações</Divider>
          <>
            <span>
              Para fins de inscrição junto ao Programa Habitacional de Interesse
              Social, declaro(amos) que Possuo(imos) renda familiar até:
            </span>

            <Grid style={{ marginTop: "10px" }}>
              <Form.Item
                label="Renda familiar até R$ 2850,00"
                name="rendaFamiliar2580"
                // rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Radio.Group size="large">
                  <Radio value={true}>Sim</Radio>
                  <Radio value={false}>Não</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Renda familiar até R$ 4.700,00 e estou(amos) enquadrado(s) na condição de Calamidade Pública/Situação de Emergência"
                name="rendaFamiliar4700"
                // rules={[{ required: true, message: "Campo obrigatório" }]}
              >
                <Radio.Group size="large">
                  <Radio value={true}>Sim</Radio>
                  <Radio value={false}>Não</Radio>
                </Radio.Group>
              </Form.Item>
            </Grid>
          </>
        </>

        <Divider style={{ margin: "10px 0px" }} />
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          style={{ marginTop: "20px", backgroundColor: "#209df0" }}
          onClick={() => setCallFormFiller(true)}
          icon={<BsFiletypePdf />}
        >
          Baixar Declaração de Beneficiário
        </Button>
      </Form>
      <PdfFormFiller dados={dadosPreenchidos} callFormFiller={callFormFiller} />
    </Modal>
  );
};

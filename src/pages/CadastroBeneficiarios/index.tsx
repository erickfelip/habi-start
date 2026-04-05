import { useEffect, useRef, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Steps,
  Checkbox,
  Tabs,
  Table,
  notification,
  Divider,
  Pagination,
} from "antd";
import * as Yup from "yup";
import {
  Container,
  GridAddress,
  GridCriterios,
  GridFamilyData,
  GridPersonalData,
  Label,
  LabelSub,
  WrapperSteps,
  WrapperTable,
} from "./styles";
import { Navbar } from "../../components/NavBar";
import PdfFormFiller from "../../components/PdfFormFillter.tsx";
import {
  parseCurrencyBRL,
  maskCep,
  maskCpf,
  estadoCivilOptions,
  sexoOptions,
  maskCurrencyBRL,
  formatDate,
  items,
} from "../../utils/index.tsx";
import {
  createBeneficiario,
  getBeneficiarios,
} from "../../services/sga.requests.ts";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";

export const stepSchemas = [
  // =========================
  // ETAPA 1
  // =========================
  Yup.object().shape({
    cpf: Yup.string().required("CPF é obrigatório"),
    nis: Yup.string().required("NIS é obrigatório"),
    nome: Yup.string().required("Nome é obrigatório"),
    rg: Yup.string().required("RG é obrigatório"),
    orgao: Yup.string().required("Órgão é obrigatório"),
    estado: Yup.string().required("Estado é obrigatório"),
    dataNascimento: Yup.string().required("Data de nascimento é obrigatória"),
    emancipado: Yup.boolean().nullable(),
    estadoCivil: Yup.string().required("Estado civil é obrigatório"),
    sexo: Yup.string().required("Sexo é obrigatório"),
    email: Yup.string().email("Email inválido").required("Email é obrigatório"),
    telefone1: Yup.string().required("Telefone é obrigatório"),
    telefone2: Yup.string().nullable(),
    mae: Yup.string().required("Nome da mãe é obrigatório"),
    rendaPessoal: Yup.string()
      .typeError("Informe um número")
      .required("Renda pessoal é obrigatória"),
    chefeDeFamilia: Yup.boolean().nullable(),
    possuiDeficiencia: Yup.boolean().nullable(),
    deficiencia: Yup.string().nullable(),
    profissao: Yup.string().required("Profissão é obrigatória"),
    totalPessoas: Yup.number()
      .typeError("Informe um número")
      .required("Total de pessoas é obrigatório"),
    rendaFamiliar: Yup.string()
      .typeError("Informe um número")
      .required("Renda familiar é obrigatória"),
    condicaoMoradia: Yup.string().required("Condição moradia é obrigatória"),
    recebemBolsaFamilia: Yup.boolean().nullable(),
    deficientesNaFamilia: Yup.boolean().nullable(),
    idososNaFamilia: Yup.boolean().nullable(),
    tipoMoradia: Yup.string().required("Tipo moradia é obrigatório"),
    trabalhoOcupacao: Yup.string().required("Trabalho/Ocupação é obrigatório"),
    filhos0a6Anos: Yup.number().typeError("Informe um número").required(),
    filhos7a18Anos: Yup.number().typeError("Informe um número").required(),
    cep: Yup.string().required("CEP é obrigatório"),
    logradouro: Yup.string().required("Logradouro é obrigatório"),
    numero: Yup.string().required("Número é obrigatório"),
    bairro: Yup.string().required("Bairro é obrigatório"),
    cidade: Yup.string().required("Cidade é obrigatória"),
    complemento: Yup.string().required("Complemento é obrigatório"),
    localStatusInscricao: Yup.string().required(
      "Local status inscrição é obrigatório"
    ),
  }),

  // =========================
  // ETAPA 2
  // =========================
  Yup.object().shape({
    nomeConjuge: Yup.string().nullable(),
    estadoCivilConjuge: Yup.string().nullable(),
    profissaoConjuge: Yup.string().nullable(),
    rgConjuge: Yup.string().nullable(),
    cpfConjuge: Yup.string().nullable(),
    rendaConjuge: Yup.string().typeError("Informe um número").nullable(),
    possuiDeficienciaConjuge: Yup.boolean().nullable(),
    conjugeVaraoAusente: Yup.boolean().nullable(),
  }),

  // =========================
  // ETAPA 3
  // =========================
  Yup.object().shape({
    mulherResponsavelUnidadeFamiliar: Yup.boolean().nullable(),
    titularOuConjugeNegro: Yup.boolean().nullable(),
    pessoaComDeficienciaNaComposicaoFamiliar: Yup.boolean().nullable(),
    idosoNaComposicaoFamiliar: Yup.boolean().nullable(),
    criancaOuAdolescenteNaComposicaoFamiliar: Yup.boolean().nullable(),
    pessoaComCancerOuDoencaRaraCronicaDegenerativa: Yup.boolean().nullable(),
    mulherVitimaViolenciaDomestica: Yup.boolean().nullable(),
    situacaoRiscoVulnerabilidade: Yup.boolean().nullable(),
    povosTradicionaisQuilombolas: Yup.boolean().nullable(),
    residentesEmAreasDeRisco: Yup.boolean().nullable(),
    situacaoDeRuaOuTrajetoriaRua: Yup.boolean().nullable(),
  }),
];

export const CadastroBeneficiario = () => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [current]);

  const { data: beneficiarios = [], isLoading: isLoadingBeneficiarios } =
    useQuery({
      queryKey: ["GET_BENEFICIARIOS", page],
      queryFn: async () => {
        const response = await getBeneficiarios({ page: page, limit: 10 });
        return response;
      },
      retry: true,
      refetchOnWindowFocus: true,
    });

  // const mapYupErrors = (err: any) => {
  //   const validationErrors = err?.inner?.length
  //     ? err.inner
  //     : err?.errorFields || [err];

  //   return validationErrors
  //     .map((e: any) => {
  //       if (e?.path) {
  //         return {
  //           name: e.path,
  //           errors: [String(e.message)],
  //         };
  //       }

  //       if (e?.name && e?.errors) {
  //         return {
  //           name: e.name,
  //           errors: e.errors.map((msg: any) => String(msg)),
  //         };
  //       }

  //       return null;
  //     })
  //     .filter(Boolean);
  // };

  const next = async () => {
    try {
      const schema = stepSchemas[current];
      const fields = Object.keys(schema.fields);
      const values = form.getFieldsValue(fields);

      await schema.validate(values, { abortEarly: false });

      setFormData((prev: any) => ({ ...prev, ...values }));
      setCurrent((prev) => prev + 1);
    } catch (err: any) {
      if (err.inner) {
        form.setFields(
          err.inner.map((e: any) => ({
            name: e.path,
            errors: [e.message],
          }))
        );
      }
    }
  };

  const prev = async () => {
    const values = form.getFieldsValue();
    setFormData({ ...formData, ...values });
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await stepSchemas[current].validate(values, { abortEarly: false });

      const payload = {
        ...formData,
        ...values,
        rendaPessoal: parseCurrencyBRL(formData!?.rendaPessoal),
        rendaConjuge: parseCurrencyBRL(formData!?.rendaConjuge),
        rendaFamiliar: parseCurrencyBRL(formData!?.rendaFamiliar),
        cpf: formData!?.cpf!?.replace(/[^a-zA-Z0-9]/g, ""),
        dataNascimento: moment(formData!?.dataNascimento, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        ),
        // rendaConjuge: parseCurrencyBRL(values.rendaConjuge),
      };

      await createBeneficiario(payload)
        .then(() => {
          form.resetFields();
          setFormData({});
          setCurrent(0);
          notification.success({
            duration: 3,
            message: "Sucesso!",
            description: `Beneficiario cadastrado.`,
          });
        })
        .catch((error) => {
          notification.error({
            duration: 1,
            message: "Erro!",
            description: `${error?.response?.data?.message}`,
          });
        });
    } catch (err: any) {
      if (err.inner) {
        const errors: any = {};
        err.inner.forEach((e: any) => {
          errors[e.path] = {
            value: form.getFieldValue(e.path),
            errors: [new Error(e.message)],
          };
        });
        form.setFields(
          Object.keys(errors).map((field) => ({
            name: field,
            errors: errors[field].errors,
          }))
        );
      }
    }
  };
  const [tab, setTab] = useState<string>("1");
  const onChange = (key: string) => {
    setTab(key);
  };

  const [loadingCep, setLoadingCep] = useState(false);
  const numeroRef: any = useRef(null);
  const debounceRef: any = useRef(null);

  const handleCepLookup = async (cep: any) => {
    const cleanCep = cep?.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    setLoadingCep(true);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        notification.error({
          message: "Endereço não encontrado",
          description: "Endereço não encontrado insira manualmente",
        });
        return;
      }

      form.setFieldsValue({
        logradouro: data.logradouro || undefined,
        bairro: data.bairro || undefined,
        cidade: data.localidade || undefined,
        estado: data.uf || undefined,
        complemento: data.complemento || undefined,
      });

      setTimeout(() => {
        numeroRef.current?.focus();
      }, 100);
    } catch {
      notification.error({
        message: "Erro ao buscar CEP",
        description: "Endereço não encontrado insira manualmente",
      });
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (e: any) => {
    const masked = maskCep(e.target.value);
    form.setFieldValue("cep", masked);

    clearAddressFields();

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef!.current = setTimeout(() => {
      handleCepLookup(masked);
    }, 600);
  };

  const handleCpfChange = (e: any) => {
    const masked = maskCpf(e.target.value);
    form.setFieldValue("cpf", masked);
  };

  const handleCpfConjugeChange = (e: any) => {
    const masked = maskCpf(e.target.value);
    form.setFieldValue("cpfConjuge", masked);
  };

  const clearAddressFields = () => {
    form.setFieldsValue({
      logradouro: undefined,
      bairro: undefined,
      cidade: undefined,
      estado: undefined,
      complemento: undefined,
    });
  };

  const steps = [
    {
      title: "Dados Pessoais",
      content: (
        <>
          {/* DADOS PESSOAIS */}
          <Divider style={{ margin: "20px 0px" }}>Dados Pessoais</Divider>
          <GridPersonalData>
            <Form.Item name="cpf" label="CPF" required>
              <Input
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                size="large"
                maxLength={14}
              />
            </Form.Item>

            <Form.Item name="nis" label="NIS" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="nome" label="Nome" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="rg" label="RG" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="orgao" label="Órgão" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="estado" label="Estado" required>
              <Input
                size="large"
                onChange={(e) => {
                  form.setFieldValue("estado", e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item
              name="dataNascimento"
              label="Data de Nascimento"
              required
            >
              <Input
                size="large"
                onChange={(e) => {
                  form.setFieldsValue({
                    dataNascimento: formatDate(e.target.value),
                  });
                }}
              />
            </Form.Item>

            <Form.Item name="estadoCivil" label="Estado Civil" required>
              <Select
                size="large"
                placeholder="Selecione"
                options={estadoCivilOptions}
                allowClear
              />
            </Form.Item>

            <Form.Item name="sexo" label="Sexo" required>
              <Select
                size="large"
                placeholder="Selecione"
                options={sexoOptions}
                allowClear
              />
            </Form.Item>

            <Form.Item name="email" label="Email" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="telefone1" label="Telefone 1" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="telefone2" label="Telefone 2">
              <Input size="large" />
            </Form.Item>

            <Form.Item name="mae" label="Mãe" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="rendaPessoal" label="Renda Pessoal" required>
              <Input
                size="large"
                inputMode="numeric"
                placeholder="0,00"
                value={form.getFieldValue("rendaPessoal")}
                onChange={(e) => {
                  form.setFieldsValue({
                    rendaPessoal: maskCurrencyBRL(e.target.value),
                  });
                }}
              />
            </Form.Item>

            <Form.Item name="profissao" label="profissao" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="emancipado"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Emancipado</Checkbox>
            </Form.Item>

            <Form.Item
              name="chefeDeFamilia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Chefe de Família</Checkbox>
            </Form.Item>

            <Form.Item
              name="possuiDeficiencia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Possui Deficiência</Checkbox>
            </Form.Item>

            <Form.Item name="deficiencia" label="Deficiência">
              <Input size="large" />
            </Form.Item>
          </GridPersonalData>

          {/*FINAL DADOS PESSOAIS */}

          {/*INCICIO SITUAÇÃO FAMILIAR */}
          <Divider style={{ margin: "20px 0px" }}>Situação Familiar</Divider>
          <GridFamilyData>
            <Form.Item
              name="totalPessoas"
              label="Total pessoas"
              required
              getValueFromEvent={(e) =>
                e.target.value ? Number(e.target.value) : false
              }
            >
              <Input type="number" min={0} size="large" />
            </Form.Item>

            <Form.Item
              name="rendaFamiliar"
              label="Renda familiar"
              required
              // getValueFromEvent={(e) =>
              //   e.target.value ? Number(e.target.value) : undefined
              // }
            >
              <Input
                size="large"
                inputMode="numeric"
                placeholder="0,00"
                value={form.getFieldValue("rendaFamiliar")}
                onChange={(e) => {
                  form.setFieldsValue({
                    rendaFamiliar: maskCurrencyBRL(e.target.value),
                  });
                }}
              />
            </Form.Item>

            <Form.Item name="condicaoMoradia" label="condicaoMoradia" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="recebemBolsaFamilia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>recebemBolsaFamilia</Checkbox>
            </Form.Item>

            <Form.Item
              name="deficientesNaFamilia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>deficientesNaFamilia</Checkbox>
            </Form.Item>

            <Form.Item
              name="idososNaFamilia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>idososNaFamilia</Checkbox>
            </Form.Item>

            <Form.Item name="tipoMoradia" label="tipoMoradia" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="trabalhoOcupacao"
              label="trabalhoOcupacao"
              required
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="filhos0a6Anos"
              label="filhos0a6Anos"
              required
              getValueFromEvent={(e) =>
                e.target.value ? Number(e.target.value) : 0
              }
            >
              <Input type="number" min={0} size="large" />
            </Form.Item>

            <Form.Item
              name="filhos7a18Anos"
              label="filhos7a18Anos"
              required
              getValueFromEvent={(e) =>
                e.target.value ? Number(e.target.value) : 0
              }
            >
              <Input type="number" min={0} size="large" />
            </Form.Item>
          </GridFamilyData>
          {/*FINAL SITUAÇÃO FAMILIAR */}

          <Divider style={{ margin: "20px 0px" }}>Endereço</Divider>
          {/* ...continuação endereço */}
          <GridAddress>
            <Form.Item name="cep" label="cep" required>
              <Input
                placeholder="00000-000"
                onChange={handleCepChange}
                disabled={loadingCep}
                size="large"
              />
            </Form.Item>
            <Form.Item name="logradouro" label="logradouro" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="numero" label="numero casa" required>
              <Input ref={numeroRef} size="large" />
            </Form.Item>
            <Form.Item name="bairro" label="bairro" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="cidade" label="cidade" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="complemento" label="complemento" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="localStatusInscricao" // nome municipio
              label="localStatusInscricao"
              required
            >
              <Input size="large" />
            </Form.Item>
          </GridAddress>
        </>
      ),
    },
    {
      title: "Situação Conjuge",
      content: (
        <>
          <Divider style={{ margin: "20px 0px" }}>Situação Conjuge</Divider>
          <GridAddress>
            <Form.Item name="cpfConjuge" label="cpfConjuge" required>
              <Input
                placeholder="000.000.000-00"
                onChange={handleCpfConjugeChange}
                size="large"
                // disabled={loadingCep}
              />
            </Form.Item>
            <Form.Item name="nomeConjuge" label="nomeConjuge" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="estadoCivilConjuge"
              label="estadoCivilConjuge"
              required
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="profissaoConjuge"
              label="profissaoConjuge"
              required
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item name="rgConjuge" label="rgConjuge" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="rendaConjuge"
              label="Renda Conjuge"
              required
              getValueFromEvent={(e) =>
                e.target.value ? Number(e.target.value) : 0
              }
            >
              <Input
                size="large"
                inputMode="numeric"
                placeholder="0,00"
                value={form.getFieldValue("rendaConjuge")}
                onChange={(e) => {
                  form.setFieldsValue({
                    rendaConjuge: maskCurrencyBRL(e.target.value),
                  });
                }}
              />
            </Form.Item>

            <Form.Item
              name="possuiDeficienciaConjuge" // nome municipio
              label="possuiDeficienciaConjuge"
              required
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="conjugeVaraoAusente" // nome municipio
              label="conjugeVaraoAusente"
              required
            >
              <Input size="large" />
            </Form.Item>
          </GridAddress>
        </>
      ),
    },
    {
      title: "Critérios Priorização",
      content: (
        <>
          <LabelSub style={{ fontWeight: "300" }}>
            Critérios de Priorização
          </LabelSub>
          <Divider />
          <GridCriterios>
            <Form.Item
              name="mulherResponsavelUnidadeFamiliar"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>mulherResponsavelUnidadeFamiliar</Checkbox>
            </Form.Item>

            <Form.Item
              name="titularOuConjugeNegro"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>titularOuConjugeNegro</Checkbox>
            </Form.Item>

            <Form.Item
              name="pessoaComDeficienciaNaComposicaoFamiliar"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>pessoaComDeficienciaNaComposicaoFamiliar</Checkbox>
            </Form.Item>

            <Form.Item
              name="idosoNaComposicaoFamiliar"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>idosoNaComposicaoFamiliar</Checkbox>
            </Form.Item>

            <Form.Item
              name="criancaOuAdolescenteNaComposicaoFamiliar"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>criancaOuAdolescenteNaComposicaoFamiliar</Checkbox>
            </Form.Item>
            <Form.Item
              name="pessoaComCancerOuDoencaRaraCronicaDegenerativa"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>
                pessoaComCancerOuDoencaRaraCronicaDegenerativa
              </Checkbox>
            </Form.Item>

            <Form.Item
              name="mulherVitimaViolenciaDomestica"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>mulherVitimaViolenciaDomestica</Checkbox>
            </Form.Item>
            <Form.Item
              name="situacaoRiscoVulnerabilidade"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>situacaoRiscoVulnerabilidade</Checkbox>
            </Form.Item>
            <Form.Item
              name="povosTradicionaisQuilombolas"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>povosTradicionaisQuilombolas</Checkbox>
            </Form.Item>
            <Form.Item
              name="residentesEmAreasDeRisco"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>residentesEmAreasDeRisco</Checkbox>
            </Form.Item>
            <Form.Item
              name="situacaoDeRuaOuTrajetoriaRua"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>situacaoDeRuaOuTrajetoriaRua</Checkbox>
            </Form.Item>
          </GridCriterios>
        </>
      ),
    },
  ];

  const columns: any = [
    {
      title: "Nome do Beneficiário",
      dataIndex: "nome",
      key: "nome",
      align: "start",
      render: (_: any, record: any) => {
        return <>{record?.nome}</>;
      },
    },
    {
      title: "cpf",
      dataIndex: "cpf",
      key: "cpf",
      align: "start",
      render: (_: any, record: any) => {
        return <>{record?.cpf}</>;
      },
    },
    {
      title: "profissao",
      dataIndex: "profissao",
      key: "profissao",
      align: "start",
      render: (_: any, record: any) => {
        return <>{record.profissao}</>;
      },
    },
    {
      title: "Ações",
      key: "action",
      render: (_: any, record: any) => {
        //as chaves do mock devem ser em snake_case
        //para ser aplicado no pdf
        const mockPayload = {
          nome: record!?.nome,
          cpf: record!?.cpf,
          profissao: record!?.profissao,
          data_nascimento: record.dataNascimento, //exemplo
        };

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <PdfFormFiller dados={mockPayload} />
          </div>
        );
      },
    },
  ];

  const mockBenef = [
    {
      nome: "Fulano Brasileiro",
      cpf: "123.456.789-00",
      profissao: "autonomo",
    },
    {
      nome: "João da Silva",
      cpf: "123.456.789-00",
      profissao: "autonomo",
    },
    {
      nome: "Maria da Silva",
      cpf: "123.456.789-00",
      profissao: "autonomo",
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
          <Label>Beneficiários</Label>
        </div>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}
      >
        <LabelSub>Cadastro e consulta de beneficiários do município.</LabelSub>
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
        {tab.includes("1") ? (
          <>
            <WrapperSteps>
              <div style={{ marginTop: "10px" }}>
                <Steps
                  current={current}
                  style={{ marginBottom: 32 }}
                  items={steps.map((item) => ({ title: item.title }))}
                />
              </div>

              <Form layout="vertical" form={form}>
                {steps[current].content}
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      marginTop: 24,
                      display: "flex",
                      gap: 8,
                      marginLeft: "auto",
                    }}
                  >
                    {current > 0 && <Button onClick={prev}>Voltar</Button>}

                    {current < steps.length - 1 && (
                      <Button type="primary" onClick={next}>
                        Próximo
                      </Button>
                    )}

                    {current === steps.length - 1 && (
                      <Button type="primary" onClick={handleSubmit}>
                        Cadastrar
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </WrapperSteps>
          </>
        ) : (
          <>
            <div
              style={{
                borderRadius: "20px",
                marginBottom: "3px",
                width: "100%",
              }}
            >
              <WrapperTable>
                <Table
                  showHeader
                  loading={isLoadingBeneficiarios}
                  style={{
                    padding: "10px",
                    width: "100%",
                  }}
                  columns={columns}
                  dataSource={beneficiarios!?.rows}
                  pagination={false}
                  locale={{ emptyText: "Nenhum dado disponível" }}
                />
              </WrapperTable>
              <Pagination
                current={page}
                onChange={(value: React.SetStateAction<number>) =>
                  setPage(value)
                }
                total={
                  beneficiarios!?.count
                    ? Math.ceil(beneficiarios!?.count / 10) * 10
                    : 1
                }
                style={{ alignSelf: "center", marginTop: "10px" }}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

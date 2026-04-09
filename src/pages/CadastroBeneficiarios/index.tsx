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
  Dropdown,
} from "antd";
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
import { MdOutlineFilterList } from "react-icons/md";
import useDebounce from "../../hooks/useDebounce.tsx";
import { stepSchemas } from "./schema.ts";

export const CadastroBeneficiario = () => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("nome");
  const [param, setParam] = useState("");
  const debouncedValue = useDebounce(param, 500);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [current]);

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

            <Form.Item name="email" label="E-mail" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="telefone1" label="Telefone 1" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="telefone2" label="Telefone 2">
              <Input size="large" />
            </Form.Item>

            <Form.Item name="mae" label="Nome da Mãe" required>
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

            <Form.Item name="profissao" label="Profissão" required>
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

            <Form.Item name="deficiencia" label="Nome da deficiência">
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

            <Form.Item name="condicaoMoradia" label="Condição moradia" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="recebemBolsaFamilia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Recebem bolsa família</Checkbox>
            </Form.Item>

            <Form.Item
              name="deficientesNaFamilia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Deficientes na família</Checkbox>
            </Form.Item>

            <Form.Item
              name="idososNaFamilia"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Idosos na família</Checkbox>
            </Form.Item>

            <Form.Item name="tipoMoradia" label="Tipo moradia" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="trabalhoOcupacao"
              label="Trabalho ocupação"
              required
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="filhos0a6Anos"
              label="Filhos de 0 a 6 anos"
              required
              getValueFromEvent={(e) =>
                e.target.value ? Number(e.target.value) : 0
              }
            >
              <Input type="number" min={0} size="large" />
            </Form.Item>

            <Form.Item
              name="filhos7a18Anos"
              label="Filhos de 7 a 18 anos"
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
            <Form.Item name="cep" label="CEP" required>
              <Input
                placeholder="00000-000"
                onChange={handleCepChange}
                disabled={loadingCep}
                size="large"
              />
            </Form.Item>
            <Form.Item name="logradouro" label="Logradouro" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="numero" label="Nº imóvel" required>
              <Input ref={numeroRef} size="large" />
            </Form.Item>
            <Form.Item name="bairro" label="Bairro" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="cidade" label="Cidade" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="complemento" label="Complemento" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item
              name="localStatusInscricao" // nome municipio
              label="Local do status inscrição"
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
            <Form.Item name="cpfConjuge" label="CPF" required>
              <Input
                placeholder="000.000.000-00"
                onChange={handleCpfConjugeChange}
                size="large"
                // disabled={loadingCep}
              />
            </Form.Item>
            <Form.Item name="nomeConjuge" label="Nome cônjuge" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="estadoCivilConjuge" label="Estado civil" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="profissaoConjuge" label="Profissão" required>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="rgConjuge" label="RG" required>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="rendaConjuge"
              label="Renda"
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
              label="Cônjuge possui deficiencia"
              required
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="conjugeVaraoAusente" // nome municipio
              label="Cônjuge varão ausente"
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
              <Checkbox>Mulher responsável pela unidade familiar</Checkbox>
            </Form.Item>

            <Form.Item
              name="titularOuConjugeNegro"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Titular ou cônjuge negro</Checkbox>
            </Form.Item>

            <Form.Item
              name="pessoaComDeficienciaNaComposicaoFamiliar"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Pessoa com deficiência na composição familiar</Checkbox>
            </Form.Item>

            <Form.Item
              name="idosoNaComposicaoFamiliar"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Idosos na composição familiar</Checkbox>
            </Form.Item>

            <Form.Item
              name="criancaOuAdolescenteNaComposicaoFamiliar"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Criança ou adolescente na composição familiar</Checkbox>
            </Form.Item>
            <Form.Item
              name="pessoaComCancerOuDoencaRaraCronicaDegenerativa"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>
                Pessoa com cancer ou doença rara cronica degenerativa
              </Checkbox>
            </Form.Item>

            <Form.Item
              name="mulherVitimaViolenciaDomestica"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Mulher vítima de violência doméstica</Checkbox>
            </Form.Item>
            <Form.Item
              name="situacaoRiscoVulnerabilidade"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Situação de risco e vulnerabilidade</Checkbox>
            </Form.Item>
            <Form.Item
              name="povosTradicionaisQuilombolas"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Povos tradicionais e quilombolas</Checkbox>
            </Form.Item>
            <Form.Item
              name="residentesEmAreasDeRisco"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Residentes em área de risco</Checkbox>
            </Form.Item>
            <Form.Item
              name="situacaoDeRuaOuTrajetoriaRua"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Encontra-se em situação de rua ou com trajetória</Checkbox>
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
          // data_nascimento: record.dataNascimento, //exemplo
          logradouro: record.logradouro,
          complemento: record.complemento,
          bairro: record.bairro,
          municipio: record.municipio, // pegar do que está cadastrado no banco
          numero: record.numero,
          uf: record.estado,
          cep: record.cep,
          telefone1: record.telefone1,
          telefone2: record.telefone2,
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                paddingBottom: "20px",
                gap: "8px",
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
            </div>

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

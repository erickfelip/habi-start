import { useEffect, useState } from "react";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import { saveAs } from "file-saver";
// import { BsFiletypePdf } from "react-icons/bs";
import pdf from "../../assets/103.pdf";
// import { Button } from "antd";
import { deficiencias, grauInstrucao } from "../../utils";

// chaves do PDF só funcionam com snake_case

function camelToSnake(str: string) {
  return str
    .replace(/([A-Z])/g, (letra) => `_${letra.toLowerCase()}`)
    .replace(/^_/, ""); // remove underscore inicial se houver
}

// Converte todas as chaves de um objeto de camelCase para snake_case
function converterChavesParaSnake(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).map(([chave, valor]) => [camelToSnake(chave), valor])
  );
}

export default function PdfFormFiller({
  dados,
  callFormFiller,
  userData,
}: any) {
  const dadosConvertidos = converterChavesParaSnake(dados);
  const newData: any = {
    ...dadosConvertidos,
    nome: userData?.nome,
    cpf: userData?.cpf,
    profissao: userData?.profissao,
    logradouro: userData?.logradouro,
    numero: userData?.numero,
    complemento: userData?.complemento,
    bairro: userData?.bairro,
    municipio: userData?.municipio,
    uf: userData?.uf ?? undefined,
    cep: userData?.cep,
    telefone1: userData?.telefone1,
    telefone2: userData?.telefone2,
  };

  const [_status, setStatus] = useState("idle"); // idle | loading | success | error

  function preencherGrauInstrucao(form: any, valorSelecionado: any) {
    grauInstrucao.forEach(({ value }) => {
      const nomeCampo = `grau_${value}`;
      try {
        const checkbox = form.getCheckBox(nomeCampo);
        if (value === valorSelecionado) {
          checkbox.check();
        } else {
          checkbox.uncheck();
        }
      } catch {
        console.warn(`Checkbox "${nomeCampo}" não encontrado no PDF`);
      }
    });
  }

  function preencherCheckboxesBooleanos(form: any, campos: any) {
    for (const [chave, valor] of Object.entries(campos)) {
      try {
        if (valor) {
          form.getCheckBox(`${chave}_sim`).check();
          form.getCheckBox(`${chave}_nao`).uncheck();
        } else {
          form.getCheckBox(`${chave}_sim`).uncheck();
          form.getCheckBox(`${chave}_nao`).check();
        }
      } catch {
        console.warn(`Checkbox "${chave}" não encontrado no PDF`);
      }
    }
  }

  function preencherCheckboxExclusivo(
    form: any,
    opcoes: any,
    valorSelecionado: any,
    prefixo = ""
  ) {
    opcoes.forEach(({ value }: any) => {
      const nomeCampo = `${prefixo}${value}`;
      try {
        const checkbox = form.getCheckBox(nomeCampo);
        value === valorSelecionado ? checkbox.check() : checkbox.uncheck();
      } catch {
        console.warn(
          `[PDF] Checkbox exclusivo "${nomeCampo}" não encontrado no PDF`
        );
      }
    });
  }

  function preencherDeficiencia(form: any, valorSelecionado: any) {
    preencherCheckboxExclusivo(
      form,
      deficiencias,
      valorSelecionado,
      "discriminacao_deficiencia_"
    );
  }

  async function gerarPDF() {
    setStatus("loading");
    try {
      const resposta = await fetch(pdf);
      if (!resposta.ok) throw new Error(`PDF não encontrado em "${pdf}"`);

      const pdfBytes = await resposta.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes, {
        ignoreEncryption: true,
      });
      const form = pdfDoc.getForm();
      const campos = form.getFields();

      if (campos.length === 0) {
        console.log("⚠️ Nenhum campo de formulário encontrado no PDF!");
      } else {
        campos.forEach((c) =>
          console.log(`Campo: "${c.getName()}" | Tipo: ${c.constructor.name}`)
        );
      }

      // Corrige a cor da fonte de todos os campos para preto
      form.getFields().forEach((field) => {
        field.acroField.dict.set(
          PDFName.of("DA"),
          PDFString.of("/Helvetica 10 Tf 0 0 0 rg")
        );
      });

      // for (const [chave, valor] of Object.entries(dadosConvertidos)) {
      //   console.log("@chave | valor", chave, valor);

      //   try {
      //     form.getTextField(chave).setText(String(valor ?? ""));
      //   } catch {
      //     console.warn(
      //       `[PdfFormFiller] Campo "${chave}" não encontrado no PDF`
      //     );
      //   }
      // }

      const camposBooleanos = {
        aceite: dadosConvertidos.conjuge_ausente,
        bpc: dadosConvertidos.recebe_bpc,
        bolsa: dadosConvertidos.bolsa,
        menor_de_18_anos: dadosConvertidos.menor_de18anos,
        recebe_bpc_conjuge: dadosConvertidos.recebe_bpc_conjuge, // trocar o field para recebe_bpc_conjuge
        recebe_bolsa_conjuge: dadosConvertidos.recebe_bolsa_conjuge,
        menor_de_18_anos_conjuge: dadosConvertidos.menor_de18anos_conjuge,
        adequacao_imovel_pretendido:
          dadosConvertidos.adequacao_imovel_pretendido,
        familia_em_situacao_de_rua: dadosConvertidos.familia_em_situacao_de_rua,
        familia_integra_deficit_habitacional:
          dadosConvertidos.familia_integra_deficit_habitacional,
        renda_familiar_2580: dadosConvertidos.renda_familiar2580,
        renda_familiar_4700: dadosConvertidos.renda_familiar4700,
      };

      preencherCheckboxesBooleanos(form, camposBooleanos);
      preencherGrauInstrucao(form, dados.grauInstrucao);
      // Cônjuge
      preencherCheckboxExclusivo(
        form,
        grauInstrucao,
        dadosConvertidos.grau_instrucao_conjuge,
        "grau_instrucao_conjuge_"
      );
      preencherDeficiencia(form, dadosConvertidos.discriminacao_deficiencia);

      campos.forEach((field: any) => {
        const nomeCampo = field.getName();
        const valor = newData[nomeCampo];

        if (valor === undefined) return;

        // console.log("Preenchendo:", nomeCampo, valor);

        try {
          if ("setText" in field) {
            field.setText(String(valor));
          } else {
            console.warn("Tipo não suportado:", nomeCampo, field);
          }
        } catch (e) {
          console.warn("Erro ao preencher:", nomeCampo, e);
        }
      });

      form.flatten();

      const pdfPreenchido = await pdfDoc.save();
      const blob = new Blob([pdfPreenchido], { type: "application/pdf" });
      saveAs(blob, "documento-preenchido.pdf");
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.log({ err });

      console.error("[PdfFormFiller]", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  // const label = {
  //   idle: "Declaração de Beneficiário (PDF)",
  //   loading: "Gerando...",
  //   success: "Download iniciado!",
  //   error: "Erro ao gerar",
  // }[status];

  useEffect(() => {
    if (callFormFiller === true) gerarPDF();
  }, [callFormFiller, dados]);

  return (
    <>
      {/* <Button
        icon={<BsFiletypePdf />}
        onClick={gerarPDF}
        disabled={status === "loading"}
      >
        {label}
      </Button> */}
    </>
  );
}

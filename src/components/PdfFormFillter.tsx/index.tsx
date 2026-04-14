import { useState } from "react";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import { saveAs } from "file-saver";
import { BsFiletypePdf } from "react-icons/bs";
import pdf from "../../assets/102.pdf";
import { Button } from "antd";
import { grauInstrucao } from "../../utils";

// chaves do PDF só funcionam com snake_case
// const dadosColaborador = {
//   nome: "Fulano de tal",
//   cpf: "123",
//   data_nascimento: "15/04/1990",
//   email: "email@email.com",
//   telefone: "123",
//   cargo: "123",
//   departamento: "123",
//   data_admissao: "123",
//   salario: "123",
//   matricula: "123",
//   local_data: "123",
// };

// dados = dadosColaborador

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

export default function PdfFormFiller({ dados }: any) {
  const dadosConvertidos = converterChavesParaSnake(dados);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

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
        recebe_bolsa_conjuge: dadosConvertidos.recebe_bpc_conjuge,
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

      campos.forEach((field: any) => {
        const nomeCampo = field.getName();
        const valor = dadosConvertidos[nomeCampo];

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
      console.log({ blob });
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.log({ err });

      console.error("[PdfFormFiller]", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  const label = {
    idle: "Declaração de Beneficiário (PDF)",
    loading: "Gerando...",
    success: "Download iniciado!",
    error: "Erro ao gerar",
  }[status];

  return (
    <Button
      icon={<BsFiletypePdf />}
      onClick={gerarPDF}
      disabled={status === "loading"}
    >
      {label}
    </Button>
  );
}

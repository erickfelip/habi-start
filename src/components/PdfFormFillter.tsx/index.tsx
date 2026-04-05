import { useState } from "react";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import { saveAs } from "file-saver";
import { BsFiletypePdf } from "react-icons/bs";
import pdf from "../../assets/teste2funcionando.pdf";
import { Button } from "antd";

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

export default function PdfFormFiller({ dados }: any) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

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
      console.log({ form });
      console.log({ campos });
      console.log({ pdfBytes });

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

      for (const [chave, valor] of Object.entries(dados)) {
        try {
          form.getTextField(chave).setText(String(valor ?? ""));
        } catch {
          console.warn(
            `[PdfFormFiller] Campo "${chave}" não encontrado no PDF`
          );
        }
      }

      form.flatten();

      const pdfPreenchido = await pdfDoc.save();
      console.log({ pdfPreenchido });

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

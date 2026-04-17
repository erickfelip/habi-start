import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

// ─────────────────────────────────────────────────────────────
// CONFIGURAÇÕES
// ─────────────────────────────────────────────────────────────

const CORES: any = {
  azulEscuro: [30, 58, 95],
  azul: [37, 99, 235],
  azulClaro: [219, 234, 254],
  cinzaClaro: [243, 244, 246],
  cinzaMedio: [156, 163, 175],
  cinzaEscuro: [55, 65, 81],
  branco: [255, 255, 255],
  verde: [22, 163, 74],
  verdeClaro: [220, 252, 231],
  laranja: [234, 88, 12],
  laranjaClaro: [255, 237, 213],
};

const LABEL_COTAS: any = {
  PCD: "PCD — Pessoa com Deficiência",
  IDOSO: "Idoso",
  VULNERABILIDADE: "Vulnerabilidade Social",
  AMPLA_CONCORRENCIA: "Ampla Concorrência",
};

// ─────────────────────────────────────────────────────────────
// UTILITÁRIOS
// ─────────────────────────────────────────────────────────────

function formatarDataHora(iso: any) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// Desenha o cabeçalho fixo em todas as páginas
function desenharCabecalho(
  doc: any,
  resultado: any,
  paginaAtual: any,
  totalPaginas: any
) {
  const { nomeDoSorteio, dataHora, totalSorteados, totalCadastroReserva } =
    resultado;
  const W = doc.internal.pageSize.getWidth();

  // Faixa superior azul escura
  doc.setFillColor(...CORES.azulEscuro);
  doc.rect(0, 0, W, 28, "F");

  // Nome do sorteio
  doc.setTextColor(...CORES.branco);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(nomeDoSorteio ?? "Resultado do Sorteio", 14, 11);

  // Data/hora
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Realizado em: ${formatarDataHora(dataHora)}`, 14, 19);

  // Número da página
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Página ${paginaAtual} de ${totalPaginas}`, W - 14, 19, {
    align: "right",
  });

  // Cards de totais
  const cardY = 32;
  const cardH = 16;
  const cardW = 70;

  // Card sorteados
  doc.setFillColor(...CORES.verdeClaro);
  doc.roundedRect(14, cardY, cardW, cardH, 2, 2, "F");
  doc.setTextColor(...CORES.verde);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("TOTAL SORTEADOS", 18, cardY + 6);
  doc.setFontSize(12);
  doc.text(String(totalSorteados ?? 0), 18, cardY + 13);

  // Card cadastro reserva
  doc.setFillColor(...CORES.laranjaClaro);
  doc.roundedRect(14 + cardW + 8, cardY, cardW, cardH, 2, 2, "F");
  doc.setTextColor(...CORES.laranja);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("CADASTRO DE RESERVA", 14 + cardW + 12, cardY + 6);
  doc.setFontSize(12);
  doc.text(String(totalCadastroReserva ?? 0), 14 + cardW + 12, cardY + 13);

  // Linha separadora
  doc.setDrawColor(...CORES.azulClaro);
  doc.setLineWidth(0.5);
  doc.line(14, cardY + cardH + 4, W - 14, cardY + cardH + 4);

  return cardY + cardH + 8; // retorna Y inicial para o conteúdo
}

// Desenha o rodapé fixo em todas as páginas
function desenharRodape(doc: any) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  doc.setDrawColor(...CORES.cinzaMedio);
  doc.setLineWidth(0.3);
  doc.line(14, H - 10, W - 14, H - 10);

  doc.setTextColor(...CORES.cinzaMedio);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Documento gerado automaticamente — Sistema", 14, H - 5);
  doc.text(new Date().toLocaleDateString("pt-BR"), W - 14, H - 5, {
    align: "right",
  });
}

// Desenha título de seção de cota
function desenharTituloCota(doc: any, cota: any, totalVagas: any, y: any) {
  const W = doc.internal.pageSize.getWidth();
  const label = LABEL_COTAS[cota] ?? cota;

  doc.setFillColor(...CORES.azulClaro);
  doc.roundedRect(14, y, W - 28, 10, 2, 2, "F");

  doc.setTextColor(...CORES.azulEscuro);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(label, 18, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Total de vagas: ${totalVagas}`, W - 18, y + 7, { align: "right" });

  return y + 14;
}

// ─────────────────────────────────────────────────────────────
// GERAÇÃO DO PDF
// ─────────────────────────────────────────────────────────────

function gerarPdfSorteio(novaLista: any) {
  const { resultado } = novaLista;
  const { vagas } = resultado;

  const doc: any = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Ordem de exibição das cotas
  const ordemCotas = ["PCD", "IDOSO", "VULNERABILIDADE", "AMPLA_CONCORRENCIA"];

  // Coleta todas as seções que serão geradas para calcular total de páginas
  // (estimativa simples — 1 página por cota com muitos dados)
  let totalPaginas = 1;
  ordemCotas.forEach((cota) => {
    const vaga = vagas[cota];
    if (!vaga) return;
    const totalItens =
      (vaga.sorteados?.length ?? 0) + (vaga.cadastroReserva?.length ?? 0);
    if (totalItens > 30) totalPaginas++;
  });

  let paginaAtual = 1;
  let yAtual = desenharCabecalho(doc, resultado, paginaAtual, totalPaginas);

  ordemCotas.forEach((cota, index) => {
    const vaga = vagas[cota];
    if (!vaga) return;

    const sorteados = vaga.sorteados ?? [];
    const reserva = vaga.cadastroReserva ?? [];
    const temDados = sorteados.length > 0 || reserva.length > 0;

    // Nova página para cada cota (exceto a primeira)
    if (index > 0) {
      doc.addPage();
      paginaAtual++;
      desenharRodape(doc);
      yAtual = desenharCabecalho(doc, resultado, paginaAtual, totalPaginas);
    }

    // Título da cota
    yAtual = desenharTituloCota(doc, cota, vaga.totalVagas, yAtual);

    if (!temDados) {
      doc.setTextColor(...CORES.cinzaMedio);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.text("Nenhum participante nesta cota.", 18, yAtual + 6);
      yAtual += 14;
      return;
    }

    // ── Tabela: Sorteados ──────────────────────────────────
    if (sorteados.length > 0) {
      doc.setTextColor(...CORES.cinzaEscuro);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Sorteados", 14, yAtual + 5);
      yAtual += 8;

      autoTable(doc, {
        startY: yAtual,
        margin: { left: 14, right: 14 },
        head: [["#", "Nome", "CPF"]],
        body: sorteados.map((p: any, i: any) => [i + 1, p.nome, p.cpf]),
        styles: {
          fontSize: 8,
          cellPadding: 3,
          textColor: CORES.cinzaEscuro,
        },
        headStyles: {
          fillColor: CORES.azul,
          textColor: CORES.branco,
          fontStyle: "bold",
          fontSize: 8,
        },
        alternateRowStyles: {
          fillColor: CORES.cinzaClaro,
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: "auto" },
          2: { cellWidth: 45 },
        },
        didDrawPage: () => {
          desenharRodape(doc);
        },
      });

      yAtual = doc.lastAutoTable.finalY + 8;
    }

    // ── Tabela: Cadastro de Reserva ────────────────────────
    if (reserva.length > 0) {
      // Se não há espaço suficiente, nova página
      if (yAtual > 220) {
        doc.addPage();
        paginaAtual++;
        desenharRodape(doc);
        yAtual = desenharCabecalho(doc, resultado, paginaAtual, totalPaginas);
        yAtual = desenharTituloCota(doc, cota, vaga.totalVagas, yAtual);
      }

      doc.setTextColor(...CORES.cinzaEscuro);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Cadastro de Reserva", 14, yAtual + 5);
      yAtual += 8;

      autoTable(doc, {
        startY: yAtual,
        margin: { left: 14, right: 14 },
        head: [["#", "Nome", "CPF"]],
        body: reserva.map((p: any, i: any) => [i + 1, p.nome, p.cpf]),
        styles: {
          fontSize: 8,
          cellPadding: 3,
          textColor: CORES.cinzaEscuro,
        },
        headStyles: {
          fillColor: CORES.laranja,
          textColor: CORES.branco,
          fontStyle: "bold",
          fontSize: 8,
        },
        alternateRowStyles: {
          fillColor: CORES.cinzaClaro,
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: "auto" },
          2: { cellWidth: 45 },
        },
        didDrawPage: () => {
          desenharRodape(doc);
        },
      });

      yAtual = doc.lastAutoTable.finalY + 8;
    }
  });

  // Rodapé da última página
  desenharRodape(doc);

  // Download
  const blob = doc.output("blob");
  const nomeArquivo = `resultado-sorteio-${Date.now()}.pdf`;
  saveAs(blob, nomeArquivo);
}

// ─────────────────────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────────────────────

export default function GerarPdfSorteio({ dados }: any) {
  const [status, setStatus] = useState<any>("idle");

  async function handleGerar() {
    if (!dados?.resultado) {
      console.error("[GerarPdfSorteio] Dados inválidos ou ausentes");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("loading");
    try {
      gerarPdfSorteio(dados);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("[GerarPdfSorteio]", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const label = {
    idle: "Gerar PDF Hierarquização",
    loading: "Gerando...",
    success: "Download iniciado!",
    error: "Erro ao gerar",
  }[status as Status];

  return (
    <button
      onClick={handleGerar}
      disabled={status === "loading"}
      style={btnStyle(status)}
    >
      {label}
    </button>
  );
}
type Status = "idle" | "loading" | "success" | "error";

function btnStyle(status: Status) {
  const bg = {
    idle: "#1e3a5f",
    loading: "#93c5fd",
    success: "#16a34a",
    error: "#dc2626",
  }[status];

  return {
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 22px",
    fontSize: 14,
    fontWeight: 500,
    cursor: status === "loading" ? "not-allowed" : "pointer",
    transition: "background 0.2s",
  };
}

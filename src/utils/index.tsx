export const parseCurrencyBRL = (value?: string): number => {
  if (!value) return 0;

  const numeric = value
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");

  return Number(numeric);
};

export const formatLabel = (value: string) => {
  const exceptions: Record<string, string> = {
    PCD: "PCD",
    IDOSO: "Idoso",
  };

  if (exceptions[value]) return exceptions[value];

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const items = [
  {
    key: "1",
    label: "Cadastrar beneficiário",
    children: <></>,
  },
  {
    key: "2",
    label: "Consultar beneficiário",
    children: <></>,
  },
];

export const maskCep = (value: string) => {
  return value
    ?.replace(/\D/g, "")
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");
};

export const maskCpf = (value: string) => {
  return value
    ?.replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const maskCnpj = (value: string) => {
  return value
    ?.replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export const estadoCivilOptions = [
  { label: "Solteiro(a)", value: "SOLTEIRO" },
  { label: "Casado(a)", value: "CASADO" },
  { label: "Divorciado(a)", value: "DIVORCIADO" },
  { label: "Separado(a)", value: "SEPARADO" },
  { label: "Viúvo(a)", value: "VIUVO" },
  { label: "União Estável", value: "UNIAO_ESTAVEL" },
];

export const grauInstrucao = [
  { label: "Analfabeto", value: "analfabeto" },
  { label: "Fundamental 1 Completo", value: "fundamental1Completo" },
  { label: "Fundamental 1 Incompleto", value: "fundamental1Incompleto" },
  { label: "Fundamental 2 Completo", value: "fundamental2Completo" },
  { label: "Fundamental 2 Incompleto", value: "fundamental2Incompleto" },
  { label: "Ensino Médio Completo", value: "ensidoMedioCompleto" },
  { label: "Ensino Médio Incompleto", value: "ensidoMedioIncompleto" },
  { label: "Ensino Superior Completo", value: "ensinoSuperiorCompleto" },
  { label: "Ensino Superior Incompleto", value: "ensinoSuperiorIncompleto" },
];

export const sexoOptions = [
  { label: "Masculino", value: "MASCULINO" },
  { label: "Feminino", value: "FEMININO" },
  { label: "Outro", value: "OUTRO" },
  { label: "Prefiro não informar", value: "NAO_INFORMAR" },
];

export const maskCurrencyBRL = (value: string) => {
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return "";

  const amount = Number(numbers) / 100;

  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (value: string): string => {
  if (!value) return "";

  // keep original for ISO-detection (contains '-') and trimmed
  const original = value.trim();

  // only digits, max 8 (DDMMYYYY or YYYYMMDD)
  const digits = original.replace(/\D/g, "").slice(0, 8);

  // detect explicit ISO like "1974-10-10"
  const looksLikeIso = /^\d{4}-\d{2}-\d{2}$/.test(original);

  // detect YYYYMMDD only when the first 4 digits look like a plausible YEAR
  // (adjust range if quiser suportar outros anos)
  const firstFour = digits.slice(0, 4);
  const firstFourNum = firstFour ? Number(firstFour) : NaN;
  const plausibleYear =
    !Number.isNaN(firstFourNum) && firstFourNum >= 1900 && firstFourNum <= 2100;

  if (looksLikeIso || (digits.length === 8 && plausibleYear)) {
    // treat as YYYYMMDD -> output DD/MM/YYYY (handles partially too)
    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);

    if (d.length === 2) return `${d}/${m}/${y}`;
    if (m.length === 2) return `${m}/${y}`; // parcial raro
    return y; // parcial (ex.: "1974")
  }

  // default: treat digits as DDMMYYYY (digitação do usuário)
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

// Utilitários das 5 etapas de execução das metas.
// Campos no Firestore (com hífen, sempre acessar com colchetes):
//   descricao-etapaN, peso-etapaN, previsao-etapaN (ISO AAAA-MM-DD), status-etapaN

export const NUMEROS_ETAPAS = [1, 2, 3, 4, 5];

export const STATUS_ETAPA = ["Planejada", "Em Partes", "Concluída", "Não Contemplada"];

// Mesmas cores usadas nos cards de status da Home
export const CORES_STATUS = {
  "Concluída": "rgba(0, 226, 0, 0.7)",
  "Em Partes": "rgba(0, 96, 163, 0.7)",
  "Planejada": "rgba(255, 255, 0, 0.7)",
  "Não Contemplada": "rgba(232, 36, 36, 0.7)",
};

export const campoEtapa = (tipo, n) => `${tipo}-etapa${n}`;

const pad = (n) => String(n).padStart(2, "0");

function dataValida(dia, mes, ano) {
  const d = new Date(ano, mes - 1, dia);
  return (
    ano >= 1000 &&
    d.getFullYear() === ano &&
    d.getMonth() === mes - 1 &&
    d.getDate() === dia
  );
}

// Converte o valor salvo (ISO, dd/mm/aaaa, dd-mm-aaaa, Date...) para ISO AAAA-MM-DD.
// Retorna "" para vazio e null quando não for uma data válida.
export function previsaoParaISO(valor) {
  if (valor === null || valor === undefined) return "";
  if (valor instanceof Date) {
    if (Number.isNaN(+valor)) return null;
    return `${valor.getFullYear()}-${pad(valor.getMonth() + 1)}-${pad(valor.getDate())}`;
  }
  const s = String(valor).trim();
  if (!s) return "";

  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|[T\s])/);
  if (m) {
    const [ano, mes, dia] = [+m[1], +m[2], +m[3]];
    return dataValida(dia, mes, ano) ? `${m[1]}-${m[2]}-${m[3]}` : null;
  }

  // dd/mm/aaaa, dd-mm-aaaa ou dd.mm.aaaa (opcionalmente seguido de hora, ex.: "31/12/2026, 10:00:00")
  m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})(?:$|[,\s])/);
  if (m) {
    const [dia, mes, ano] = [+m[1], +m[2], +m[3]];
    return dataValida(dia, mes, ano) ? `${ano}-${pad(mes)}-${pad(dia)}` : null;
  }

  return null;
}

// ISO (ou outro formato aceito) -> dd/mm/aaaa para exibição.
// Se não for possível converter, devolve o texto original (ex.: digitação incompleta).
export function previsaoParaBR(valor) {
  const iso = previsaoParaISO(valor);
  if (iso === "") return "";
  if (iso === null) return String(valor);
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Aplica a máscara dd/mm/aaaa enquanto o usuário digita
export function mascaraData(texto) {
  const d = String(texto).replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function formatarPeso(peso) {
  const s = String(peso ?? "").trim();
  if (!s) return "—";
  return s.endsWith("%") ? s : `${s}%`;
}

// Soma os pesos das etapas com status "Concluída" (pesos lidos do documento)
export function calcularPorcentagemExecucao(meta) {
  const total = NUMEROS_ETAPAS.reduce((soma, n) => {
    if (meta?.[campoEtapa("status", n)] !== "Concluída") return soma;
    const peso = parseFloat(String(meta?.[campoEtapa("peso", n)] ?? "").replace(",", "."));
    return Number.isFinite(peso) ? soma + peso : soma;
  }, 0);
  return String(Math.round(total * 100) / 100);
}

// Retorna a lista de etapas com previsão inválida (vazia = tudo certo)
export function etapasComPrevisaoInvalida(meta) {
  return NUMEROS_ETAPAS.filter(
    (n) => previsaoParaISO(meta?.[campoEtapa("previsao", n)]) === null
  );
}

// Validação para usar no handleSave dos modais. Retorna true se pode salvar.
export function validarEtapasAntesDeSalvar(meta) {
  const invalidas = etapasComPrevisaoInvalida(meta);
  if (invalidas.length) {
    alert(
      `Previsão inválida na(s) etapa(s) ${invalidas.join(", ")}. ` +
        `Use o formato dd/mm/aaaa com uma data existente ou deixe o campo vazio.`
    );
    return false;
  }
  return true;
}

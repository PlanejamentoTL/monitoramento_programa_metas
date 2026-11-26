import { PERIODO_ATUAL } from "../config/periodoAtual";
import { NUMEROS_ETAPAS, campoEtapa, previsaoParaISO, ehContinuidade, CAMPO_TIPO_META } from "./etapas";

// Status do semestre atual que exigem documento comprobatório
export const STATUS_EXIGEM_DOCUMENTO = ["Concluída", "Não Contemplada"];

export const MSG_DOCUMENTO = "Anexe um documento comprobatório";

const vazio = (v) => String(v ?? "").trim() === "";

export function documentoObrigatorio(meta) {
  return STATUS_EXIGEM_DOCUMENTO.includes(meta?.[`status-${PERIODO_ATUAL}`]);
}

export function documentoPendente(meta) {
  return documentoObrigatorio(meta) && vazio(meta?.["documentos-comprobatorios"]);
}

// Campo do status do semestre atual (obrigatório em todos os modais)
export const campoStatusAtual = () => ({
  key: `status-${PERIODO_ATUAL}`,
  label: `Status ${PERIODO_ATUAL}`,
});

// Valida a meta antes de salvar.
//   campos: [{ key, label }] campos simples obrigatórios do modal
// Retorna { documento: bool, faltando: [labels], datasInvalidas: [n] }
// e "ok" quando não há pendências.
export function validarMeta(meta, { campos = [], etapas = true } = {}) {
  const faltando = campos.filter((c) => vazio(meta?.[c.key])).map((c) => c.label);
  const datasInvalidas = [];

  // Investimento / Continuidade é obrigatório em todos os modais
  if (vazio(meta?.[CAMPO_TIPO_META])) faltando.unshift("Investimento / Continuidade");

  // Metas de continuidade não têm etapas (previsão/status gravados como "-")
  if (etapas && !ehContinuidade(meta)) {
    NUMEROS_ETAPAS.forEach((n) => {
      const previsao = meta?.[campoEtapa("previsao", n)];
      const iso = previsaoParaISO(previsao);
      // Etapa "Não Contemplada" não exige previsão (mas, se preenchida, precisa ser válida)
      const exigePrevisao = meta?.[campoEtapa("status", n)] !== "Não Contemplada";
      if (iso === null) datasInvalidas.push(n);
      else if (iso === "" && exigePrevisao) faltando.push(`Etapa ${n}: Previsão`);
      if (vazio(meta?.[campoEtapa("status", n)])) faltando.push(`Etapa ${n}: Status`);
    });
  }

  const documento = documentoPendente(meta);
  return {
    ok: !documento && faltando.length === 0 && datasInvalidas.length === 0,
    documento,
    faltando,
    datasInvalidas,
  };
}

// ---------------------------------------------------------------------------
// Meta "Não Contemplada" no semestre atual
//
// Ao marcar o status do semestre atual como "Não Contemplada":
//   - os semestres SEGUINTES ao atual passam a "Não Contemplada"
//     (semestres anteriores são mantidos, para preservar o histórico);
//   - os campos obrigatórios vazios recebem "0" (campos numéricos) ou "-";
//   - Investimento / Continuidade vazio recebe "-";
//   - etapas sem status recebem "Não Contemplada" (dispensa a previsão).
// Campos já preenchidos (exceto os status dos semestres) não são alterados.
// O documento comprobatório continua obrigatório (documentoObrigatorio).
export const NAO_CONTEMPLADA = "Não Contemplada";

const CAMPO_NUMERICO = /^(meta-indicador|meta-fisica|meta-financeira|resultado-indicador|porcentagem-execucao)/;

export function preenchimentoNaoContemplada(meta, { campos = [], semestres = [], etapas = true } = {}) {
  const mudancas = {};

  // "AAAA-S" em ordem alfabética = ordem cronológica
  semestres.filter((s) => s > PERIODO_ATUAL).forEach((s) => {
    const k = `status-${s}`;
    if (meta?.[k] !== NAO_CONTEMPLADA) mudancas[k] = NAO_CONTEMPLADA;
  });

  campos.forEach(({ key }) => {
    if (key in mudancas || !vazio(meta?.[key])) return;
    mudancas[key] = CAMPO_NUMERICO.test(key) ? "0" : "-";
  });

  if (vazio(meta?.[CAMPO_TIPO_META])) mudancas[CAMPO_TIPO_META] = "-";

  if (etapas && !ehContinuidade(meta)) {
    NUMEROS_ETAPAS.forEach((n) => {
      const k = campoEtapa("status", n);
      if (vazio(meta?.[k])) mudancas[k] = NAO_CONTEMPLADA;
    });
  }

  return mudancas;
}

// Envia as alterações acima pelo onChangeField quando o campo alterado é o
// status do semestre atual e o novo valor é "Não Contemplada".
export function aplicarNaoContemplada(k, v, meta, onChangeField, opcoes) {
  if (k !== `status-${PERIODO_ATUAL}` || v !== NAO_CONTEMPLADA) return;
  const mudancas = preenchimentoNaoContemplada({ ...meta, [k]: v }, opcoes);
  Object.entries(mudancas).forEach(([campo, valor]) => onChangeField?.(campo, valor));
}

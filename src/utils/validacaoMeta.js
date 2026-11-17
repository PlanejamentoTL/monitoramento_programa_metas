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

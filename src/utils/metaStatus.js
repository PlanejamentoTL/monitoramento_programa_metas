import { PERIODO_ATUAL } from "../config/periodoAtual";

// Verifica se o campo relevante do semestre atual está preenchido para a meta,
// de acordo com o plano selecionado (cada plano usa um campo diferente):
// - Plano de Governo: não tem "plano de ação" nem "resultado indicador",
//   então usa o status do semestre atual (vazio == opção "Selecionar"), além
//   dos campos de porcentagem de execução e previsão de conclusão.
// - PPA e LDO: usam o resultado do indicador do semestre atual.
// - Demais planos (planos gerais): usam o campo único "plano de ação", além
//   dos campos de porcentagem de execução e previsão de conclusão.
export function isMetaCompleta(row, plano) {
  const porcentagemExecucao = String(row?.["porcentagem-execucao"] ?? "").trim();
  const previsaoConclusao = String(row?.["data-conclusao"] ?? "").trim();

  if (plano === "plano-governo") {
    const status = String(row?.[`status-${PERIODO_ATUAL}`] ?? "").trim();
    return status !== "" && porcentagemExecucao !== "" && previsaoConclusao !== "";
  }

  if (plano === "plano-plurianual" || plano === "ldo-2026") {
    const resultado = String(row?.[`resultado-indicador-${PERIODO_ATUAL}`] ?? "").trim();
    return resultado !== "";
  }

  const planoAcao = String(row?.["plano-acao"] ?? "").trim();
  return planoAcao !== "" && porcentagemExecucao !== "" && previsaoConclusao !== "";
}

// Vigência (anos) dos "planos gerais" que usam o modal Pop_up_planos_gerais.
// Os campos anuais (meta-indicador-AAAA, meta-financeira-AAAA) e semestrais
// (status-AAAA-S, resultado-indicador-AAAA-S) do modal são gerados a partir daqui.

export const ANOS_PADRAO_PLANOS_GERAIS = [2025, 2026, 2027, 2028];

const ANOS_POR_PLANO = {
  "plano-setorial-smas-2026-2029": [2026, 2027, 2028, 2029],
};

export const anosDoPlano = (plano) => ANOS_POR_PLANO[plano] ?? ANOS_PADRAO_PLANOS_GERAIS;

// ["2025-1", "2025-2", "2026-1", ...]
export const semestresDosAnos = (anos) => anos.flatMap((a) => [`${a}-1`, `${a}-2`]);

// Contagens de status usadas no painel (gráficos) e no relatório .docx
import { PERIODO_ATUAL } from "../config/periodoAtual";

export const STATUS = ["Concluída", "Em Partes", "Planejada", "Não Contemplada"];
export const SEM_STATUS = "Sem status";
export const CATEGORIAS = [...STATUS, SEM_STATUS];

export const CORES_GRAFICO = {
  "Concluída": "#4CAF50",
  "Em Partes": "#0060a3",
  "Planejada": "#ffff00",
  "Não Contemplada": "#ea4335",
  [SEM_STATUS]: "#c9c9c9",
};

export function categoriaStatus(valor) {
  const s = String(valor ?? "").trim();
  return STATUS.includes(s) ? s : SEM_STATUS;
}

// Semestres disponíveis no plano (campos "status-AAAA-S"), em ordem e até o período atual
export function semestresDoPlano(rows) {
  const set = new Set();
  rows.forEach((r) =>
    Object.keys(r).forEach((k) => {
      const m = k.match(/^status-(\d{4}-[12])$/);
      if (m) set.add(m[1]);
    })
  );
  return [...set].sort().filter((p) => p <= PERIODO_ATUAL);
}

// Quantidade de metas em cada categoria de status no semestre informado
export function contarStatus(rows, periodo = PERIODO_ATUAL) {
  const c = Object.fromEntries(CATEGORIAS.map((s) => [s, 0]));
  rows.forEach((r) => c[categoriaStatus(r[`status-${periodo}`])]++);
  return c;
}

// Evolução: contagem por status para cada semestre
export function evolucaoStatus(rows) {
  const semestres = semestresDoPlano(rows);
  return { semestres, contagem: semestres.map((p) => contarStatus(rows, p)) };
}

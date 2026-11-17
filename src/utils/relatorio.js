// Emissão do relatório .docx a partir do modelo public/modelos/relatorio.docx
//
// Campos do modelo: {{nome-do-campo}} (pode ter hífen, como no Firestore).
//  - Fora do loop: dados gerais (nome-plano, qtd-concluidas, gráficos...)
//  - Dentro de {{FOR m IN metas}} ... {{END-FOR m}}: campos da meta (n, meta, status-2026-1...)
//  - Gráficos: {{IMAGE grafico-rosca-atual}} e {{IMAGE grafico-barra-evolucao}}
import { createReport } from "docx-templates/lib/browser.js";
import { PERIODO_ATUAL } from "../config/periodoAtual";
import { contarStatus } from "./estatisticasStatus";
import { graficoRoscaPNG, graficoEvolucaoPNG, TAMANHO_CM } from "./graficosRelatorio";
import { NUMEROS_ETAPAS, campoEtapa, previsaoParaBR } from "./etapas";

export const NOMES_PLANOS = {
  "plano-governo": "Plano de Governo",
  "plano-plurianual": "Plano Plurianual 2026-2029",
  "ldo-2026": "Lei de Diretrizes Orçamentárias 2026",
  "plano-diretor": "Plano Diretor",
  "plano-primeira-infancia": "Plano Municipal da 1ª Infância",
  "plano-tres-lagoas-sustentavel": "Plano Três Lagoas Sustentável",
  "plano-setorial": "Plano Setorial - Assistência Social",
  "base-teste": "Teste",
};

export const NOMES_SECRETARIAS = {
  Todas: "Todas as secretarias",
  SEGOV: "Secretaria de Governo",
  SMS: "Secretaria de Saúde",
  Gabinete: "Gabinete",
  SGI: "Secretaria de Gestão de Pessoas",
  SEMEA: "Secretaria de Meio Ambiente e Agronegócio",
  "SEMEA-AGRO": "Diretoria de Agronegócio",
  "SEGOV-habitacao": "Diretoria de Habitação",
  "SEGOV-HAB": "Diretoria de Habitação",
  SEFIRC: "Secretaria de Finanças, Receita e Controle",
  SEJUVEL: "Secretaria de Esporte, Juventude e Lazer",
  SEDECT: "Secretaria de Desenvolvimento Econômico, Ciência e Tecnologia",
  SEMEC: "Secretaria de Educação",
  "SEMEC-Cultura": "Secretaria de Cultura",
  SEINTRA: "Secretaria de Infraestrutura, Transporte e Trânsito",
  "SEINTRA-TT": "Diretoria de Transporte e Trânsito",
  SMAS: "Secretaria de Assistência Social",
};

const VAZIO = "—";
const txt = (v) => {
  const s = String(v ?? "").trim();
  return s ? s : VAZIO;
};

// Etapa mais avançada concluída (0 = nenhuma). Usada nos totais por fase do modelo.
export function faseDaMeta(row) {
  let fase = 0;
  NUMEROS_ETAPAS.forEach((n) => {
    if (row[campoEtapa("status", n)] === "Concluída") fase = n;
  });
  return fase;
}

// Campos de cada meta usados dentro do loop {{FOR m IN metas}}
function dadosDaMeta(row) {
  const d = {
    n: txt(row.numero),
    numero: txt(row.numero),
    meta: txt(row.meta || row.objetivo),
    objetivo: txt(row.objetivo),
    detalhamento: txt(row.detalhamento),
    indicador: txt(row.indicador),
    "un-medida": txt(row["un-medida"]),
    "porcentagem-execucao": txt(row["porcentagem-execucao"]),
  };

  NUMEROS_ETAPAS.forEach((n) => {
    d[campoEtapa("descricao", n)] = txt(row[campoEtapa("descricao", n)]);
    d[campoEtapa("peso", n)] = txt(row[campoEtapa("peso", n)]);
    d[campoEtapa("previsao", n)] = txt(previsaoParaBR(row[campoEtapa("previsao", n)]));
    d[campoEtapa("status", n)] = txt(row[campoEtapa("status", n)]);
  });

  for (let ano = 2025; ano <= 2029; ano++) {
    // Planos gerais usam "meta-indicador-AAAA"; PPA/LDO usam "meta-fisica-AAAA"
    d[`meta-indicador-${ano}`] = txt(row[`meta-indicador-${ano}`] ?? row[`meta-fisica-${ano}`]);
    d[`meta-financeira-${ano}`] = txt(row[`meta-financeira-${ano}`]);
    for (const s of [1, 2]) {
      d[`status-${ano}-${s}`] = txt(row[`status-${ano}-${s}`]);
      d[`resultado-indicador-${ano}-${s}`] = txt(row[`resultado-indicador-${ano}-${s}`]);
    }
  }

  // Demais campos da meta, para poder usar qualquer campo do Firestore no modelo
  Object.keys(row).forEach((k) => {
    if (!(k in d) && typeof row[k] !== "object") d[k] = txt(row[k]);
  });
  return d;
}

const ordenarPorNumero = (a, b) =>
  String(a.numero ?? "").localeCompare(String(b.numero ?? ""), "pt-BR", { numeric: true });

function montarDados(rows, plano, secretaria) {
  const status = contarStatus(rows, PERIODO_ATUAL);
  const fases = [0, 0, 0, 0, 0, 0];
  rows.forEach((r) => fases[faseDaMeta(r)]++);

  const imagem = (data) => ({ ...TAMANHO_CM, data, extension: ".png" });
  const rosca = imagem(graficoRoscaPNG(rows));
  const evolucao = imagem(graficoEvolucaoPNG(rows));

  return {
    "nome-plano": NOMES_PLANOS[plano] || plano,
    "nome-secretaria": NOMES_SECRETARIAS[secretaria] || secretaria,
    "periodo-atual": PERIODO_ATUAL,
    "data-emissao": new Date().toLocaleDateString("pt-BR"),
    "total-metas": String(rows.length),

    "grafico-rosca-atual": rosca,
    "grafico-barra-evolucao": evolucao,
    "grafico-barra-evolucaol": evolucao, // nome usado no modelo original (com "l" no fim)

    "qtd-concluidas": String(status["Concluída"]),
    "qtd-em-partes": String(status["Em Partes"]),
    "qtd-planejadas": String(status["Planejada"]),
    "qtd-nao-contempladas": String(status["Não Contemplada"]),
    "qtd-sem-status": String(status["Sem status"]),

    "qtd-sem-atividade": String(fases[0]),
    "qtd-planejamento": String(fases[1]),
    "qtd-garantida": String(fases[2]),
    "qtd-contratacao": String(fases[3]),
    "qtd-executada": String(fases[4]),
    "qtd-encerramento": String(fases[5]),

    metas: [...rows].sort(ordenarPorNumero).map(dadosDaMeta),
  };
}

// Permite {{nome-com-hifen}} no modelo. O docx-templates avalia cada comando como
// JavaScript, onde "status-2026-1" seria uma subtração. Aqui, quando o comando é só
// um nome de campo, ele é procurado primeiro na meta do loop atual e depois nos
// dados gerais. Qualquer outro comando é executado normalmente.
const NOME_CAMPO = /^[\p{L}\w-]+$/u;

function runJs({ sandbox, ctx }) {
  const code = String(sandbox.__code__ ?? "").trim();

  if (NOME_CAMPO.test(code)) {
    const vars = Object.keys(ctx.vars || {}).reverse(); // loop mais interno primeiro
    for (const v of vars) {
      const item = ctx.vars[v];
      if (item && typeof item === "object" && code in item) {
        return { modifiedSandbox: sandbox, result: item[code] };
      }
    }
    if (code in sandbox) return { modifiedSandbox: sandbox, result: sandbox[code] };
    if (code.includes("-")) return { modifiedSandbox: sandbox, result: VAZIO };
  }

  const wrapper = new Function("with(this) { return eval(__code__); }");
  return { modifiedSandbox: sandbox, result: wrapper.call(sandbox) };
}

function baixar(bytes, nome) {
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function emitirRelatorio(rows, plano, secretaria) {
  if (!rows?.length) {
    alert("Não há metas para o plano e a secretaria selecionados.");
    return;
  }

  const resp = await fetch(`${import.meta.env.BASE_URL}modelos/relatorio.docx`);
  if (!resp.ok) throw new Error(`Modelo do relatório não encontrado (HTTP ${resp.status}).`);
  const template = new Uint8Array(await resp.arrayBuffer());

  const report = await createReport({
    template,
    data: montarDados(rows, plano, secretaria),
    cmdDelimiter: ["{{", "}}"],
    runJs,
    processLineBreaks: true,
    fixSmartQuotes: true,
  });

  const hoje = new Date().toISOString().slice(0, 10);
  baixar(report, `relatorio-${plano}-${secretaria}-${hoje}.docx`);
}

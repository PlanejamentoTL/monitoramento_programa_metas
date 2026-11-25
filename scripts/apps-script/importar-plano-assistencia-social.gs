/**
 * Importação do novo plano de Assistência Social (planilha -> Firestore).
 *
 * Gera documentos na MESMA estrutura da coleção "plano-setorial", mas grava
 * em outra coleção (COLECAO). Não altera nada em "plano-setorial".
 *
 * COMO A PLANILHA DEVE ESTAR
 *   - Linha 1 = cabeçalho com o NOME DO CAMPO do Firestore (ex.: numero, meta,
 *     detalhamento, ods-vinculados, indicador, un-medida, meta-indicador-2026...).
 *     A ordem das colunas não importa. Colunas com outro nome são ignoradas
 *     (aparecem no log).
 *   - Campos que não estiverem na planilha recebem o valor padrão (vazio, etapas
 *     padrão, plano/secretaria das constantes abaixo).
 *
 * CREDENCIAIS (não deixe a chave no código!)
 *   Extensões > Apps Script > Configurações do projeto > Propriedades do script:
 *     FIREBASE_EMAIL = e-mail da conta de serviço
 *     FIREBASE_KEY   = private_key do JSON (pode colar com os "\n" literais)
 *
 * USO
 *   Menu "Firebase" > "1. Pré-visualizar importação": cria a aba "Prévia
 *   importação" com o que será gravado (não grava nada no Firestore).
 *   Menu "Firebase" > "2. Importar para o Firestore": grava. Metas já
 *   existentes (mesmo número) são PULADAS, então rodar de novo não duplica
 *   nem sobrescreve o que a secretaria já preencheu no sistema.
 */

// ===== Configuração =====
const PROJECT_ID = "base-dados-programa-metas";
const COLECAO = "plano-assistencia-social";           // nome da nova coleção
const PLANO_NOME = "Plano de Assistência Social";     // valor do campo "plano"
const SECRETARIA = "SMAS";                            // sigla da secretaria
const ABA_PREVIA = "Prévia importação";

// Vigência do plano: 2026 a 2029
const ANOS = ["2026", "2027", "2028", "2029"];
const SEMESTRES = ["2026-1", "2026-2", "2027-1", "2027-2", "2028-1", "2028-2", "2029-1", "2029-2"];

const ETAPAS_PADRAO = [
  { descricao: "O que vamos fazer está definido e documentado?", peso: "10" },
  { descricao: "Recurso, projeto, licenças e autorizações estão assegurados?", peso: "15" },
  { descricao: "Quem vai executar já está contratado ou alocado?", peso: "15" },
  { descricao: "O objeto foi realizado?", peso: "45" },
  { descricao: "Foi entregue à população, recebido e formalmente encerrado?", peso: "15" },
];

const STATUS_VALIDOS = ["Planejada", "Em Partes", "Concluída", "Não Contemplada"];

// ===== Estrutura padrão de uma meta (mesmos campos do plano-setorial) =====
function metaPadrao() {
  const m = {
    "numero": "",
    "meta": "",
    "detalhamento": "",
    "ods-vinculados": "",
    "plano": PLANO_NOME,
    "secretaria-responsavel": SECRETARIA,
    "indicador": "",
    "un-medida": "",
    "investimento-continuidade": "",
    "plano-acao": "",
    "data-conclusao": "",
    "justificativa-nao-conclusao": "",
    "informacoes-adicionais": "",
    "documentos-comprobatorios": "",
    "documentos-justificativa": "",
    "porcentagem-execucao": "0",
    "data-ultima-atualizacao": "",
    "responsavel-ultima-atualizacao": "-",
    "programa": "",
    "orcamento": "",
  };
  ANOS.forEach((a) => {
    m["meta-indicador-" + a] = "";
    m["meta-financeira-" + a] = "";
  });
  SEMESTRES.forEach((s) => {
    m["status-" + s] = "";
    m["resultado-indicador-" + s] = "";
  });
  ETAPAS_PADRAO.forEach((e, i) => {
    const n = i + 1;
    m["descricao-etapa" + n] = e.descricao;
    m["peso-etapa" + n] = e.peso;
    m["previsao-etapa" + n] = "";
    m["status-etapa" + n] = "";
  });
  return m;
}

// ===== Conversão de valores =====
function paraTexto(valor, campo) {
  if (valor === null || valor === undefined) return "";
  if (valor instanceof Date) {
    // Datas sempre em AAAA-MM-DD (padrão do sistema)
    return Utilities.formatDate(valor, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  let texto = String(valor).trim();

  // Status: normaliza maiúsculas/minúsculas e acentos para os valores oficiais
  if (/^status-/.test(campo) && texto && texto !== "-") {
    const chave = normalizar(texto);
    const oficial = STATUS_VALIDOS.find((s) => normalizar(s) === chave);
    if (oficial) texto = oficial;
  }
  if (campo === "investimento-continuidade" && texto) {
    const chave = normalizar(texto);
    if (chave === "investimento") texto = "Investimento";
    if (chave === "continuidade") texto = "Continuidade";
  }
  return texto;
}

function normalizar(s) {
  return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

// Lê a aba ativa e devolve { metas, ignoradas, avisos }
function lerMetasDaPlanilha() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dados = sheet.getDataRange().getValues();
  const cabecalho = dados[0].map((c) => String(c).trim());
  const modelo = metaPadrao();

  const ignoradas = cabecalho.filter((c) => c && !(c in modelo));
  const avisos = [];
  const metas = [];
  const numerosVistos = {};

  dados.slice(1).forEach((linha, i) => {
    if (linha.every((v) => v === "" || v === null)) return; // linha vazia

    const meta = metaPadrao();
    cabecalho.forEach((campo, col) => {
      if (campo in meta) meta[campo] = paraTexto(linha[col], campo);
    });
    // plano e secretaria sempre padronizados, mesmo que a planilha traga outro texto
    meta["plano"] = PLANO_NOME;
    meta["secretaria-responsavel"] = SECRETARIA;

    const nLinha = i + 2;
    if (!meta["numero"]) {
      avisos.push("Linha " + nLinha + ": sem número da meta (ignorada).");
      return;
    }
    if (numerosVistos[meta["numero"]]) {
      avisos.push("Linha " + nLinha + ": número " + meta["numero"] + " repetido (ignorada).");
      return;
    }
    numerosVistos[meta["numero"]] = true;

    metas.push(meta);
  });

  return { metas: metas, ignoradas: ignoradas, avisos: avisos };
}

// ID do documento: meta-<numero> (permite rodar de novo sem duplicar)
function idDaMeta(meta) {
  return "meta-" + String(meta["numero"]).replace(/[\/\s]+/g, "-");
}

// ===== 1. Pré-visualização (não grava no Firestore) =====
function previsualizarImportacao() {
  const r = lerMetasDaPlanilha();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let aba = ss.getSheetByName(ABA_PREVIA);
  if (aba) aba.clear();
  else aba = ss.insertSheet(ABA_PREVIA);

  const campos = Object.keys(metaPadrao());
  const linhas = [["id-documento"].concat(campos)];
  r.metas.forEach((m) => linhas.push([idDaMeta(m)].concat(campos.map((c) => m[c]))));
  aba.getRange(1, 1, linhas.length, linhas[0].length).setNumberFormat("@").setValues(linhas);
  aba.setFrozenRows(1);

  let msg = r.metas.length + " meta(s) prontas para a coleção \"" + COLECAO + "\".";
  if (r.ignoradas.length) msg += "\n\nColunas ignoradas (nome não é um campo do sistema):\n- " + r.ignoradas.join("\n- ");
  if (r.avisos.length) msg += "\n\nAvisos:\n- " + r.avisos.join("\n- ");
  SpreadsheetApp.getUi().alert(msg);
}

// ===== 2. Importação para o Firestore =====
function importarParaFirestore() {
  const ui = SpreadsheetApp.getUi();
  const r = lerMetasDaPlanilha();
  if (!r.metas.length) {
    ui.alert("Nenhuma meta encontrada na aba ativa.");
    return;
  }

  const ok = ui.alert(
    "Importar " + r.metas.length + " meta(s) para a coleção \"" + COLECAO + "\"?\n" +
      "Metas que já existem nessa coleção serão puladas.",
    ui.ButtonSet.YES_NO
  );
  if (ok !== ui.Button.YES) return;

  const firestore = conectarFirestore();
  let criadas = 0;
  let puladas = 0;
  const erros = [];

  r.metas.forEach((meta) => {
    const caminho = COLECAO + "/" + idDaMeta(meta);
    if (documentoExiste(firestore, caminho)) {
      puladas++;
      return;
    }
    try {
      const doc = Object.assign({}, meta, { "sincronizado-em": new Date() });
      firestore.createDocument(caminho, doc);
      criadas++;
      Logger.log("Criada: " + caminho + " - " + meta["meta"]);
    } catch (e) {
      erros.push(meta["numero"] + ": " + e.message);
    }
  });

  let msg = "Criadas: " + criadas + "\nJá existiam (puladas): " + puladas;
  if (erros.length) msg += "\n\nErros:\n- " + erros.join("\n- ");
  ui.alert(msg);
}

function conectarFirestore() {
  const props = PropertiesService.getScriptProperties();
  const email = props.getProperty("FIREBASE_EMAIL");
  const key = (props.getProperty("FIREBASE_KEY") || "").replace(/\\n/g, "\n");
  if (!email || !key) {
    throw new Error("Configure FIREBASE_EMAIL e FIREBASE_KEY nas Propriedades do script.");
  }
  return FirestoreApp.getFirestore(email, key, PROJECT_ID);
}

function documentoExiste(firestore, caminho) {
  try {
    firestore.getDocument(caminho);
    return true;
  } catch (e) {
    return false; // FirestoreApp lança erro quando o documento não existe
  }
}

// Menu na planilha
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Firebase")
    .addItem("1. Pré-visualizar importação", "previsualizarImportacao")
    .addItem("2. Importar para o Firestore", "importarParaFirestore")
    .addToUi();
}

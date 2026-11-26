// components/EditPGModal.jsx
import React, { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import '../estilos/pop-up.css';
import { PERIODO_ATUAL } from "../config/periodoAtual";
import EtapasMeta from "../components/EtapasMeta";
import DocumentoComprobatorio from "../components/DocumentoComprobatorio";
import AvisoValidacao from "../components/AvisoValidacao";
import { validarMeta, campoStatusAtual, aplicarNaoContemplada } from "../utils/validacaoMeta";
import { anosDoPlano, semestresDosAnos } from "../config/planos";

const STATUS = ["Concluída", "Em Partes", "Planejada", "Não Contemplada"];

// Divide uma lista em linhas de `n` itens (layout em grade do modal)
const emLinhas = (lista, n) =>
  Array.from({ length: Math.ceil(lista.length / n) }, (_, i) => lista.slice(i * n, i * n + n));



export default function EditPlanosGeraisModal({
  isOpen,
  meta = {},
  loading = false,
  onClose,
  onChangeField,
  onSave,
   uploadParaDrive,
  plano,
}) {

  const [aviso, setAviso] = useState(null);
  if (!isOpen) return null;

  // helpers
  const gv = (k) => meta?.[k] ?? ""; // get value safe
  const isReadOnly = (k) =>
    [
      // campos somente leitura no seu HTML (spans)
      "Numero",
      "Meta",
      "Objetivo_meta",
      "Detalhamento_meta",
      "ODS",
      "Indicador",
      "Unidade_medida",
      "Tipo_meta",
      "Custeio_investimento",
      "Programa",
      "Funcao",
      "Sub_funcao",
      "Fonte_orcamentaria",
      "CO_fonte_orcamentaria",
      "Projeto_atividade",
      "Meta_estruturante",
      "Meta_fisica_2026",
      "Meta_financeira_2026",
      "Meta_fisica_2027",
      "Meta_financeira_2027",
      "Meta_fisica_2028",
      "Meta_financeira_2028",
      "Meta_fisica_2029",
      "Meta_financeira_2029",
      "Informacoes_adicionais",
      "Ultima_atualizacao",
      "Responsavel_envio",
    ].includes(k);

  // mapeamento de chaves do seu dataset -> ids do HTML
  // (ajuste os nomes conforme os cabeçalhos reais da planilha)


  // campos editáveis simples (inputs)
  const editableInputs = [
    "Resultado_indicador_2025_1",
    // "Resultado_indicador_2025_2", // readonly no seu HTML
    // "Resultado_indicador_2026_1", // readonly
    // "Resultado_indicador_2026_2", // readonly
    // "Resultado_indicador_2027_1", // readonly
    // "Resultado_indicador_2027_2", // readonly
    // "Resultado_indicador_2028_1", // readonly (dupe demonstrativa)
    // "Resultado_indicador_2028_2", // readonly (dupe demonstrativa)
    "Porcentagem_execucao",
    "Data_conclusao",
  ];

  function handleChange(k, v) {
    onChangeField?.(k, v);
    // Status atual "Não Contemplada": replica nos demais semestres e preenche
    // os obrigatórios vazios com "-"/"0" (o documento continua obrigatório)
    aplicarNaoContemplada(k, v, meta, onChangeField, { campos: camposObrigatorios, semestres: semestres });
  }

  // Anos de vigência do plano (ex.: 2025-2028 ou 2026-2029) e seus semestres
  const anos = anosDoPlano(plano);
  const semestres = semestresDosAnos(anos);

  // Campos obrigatórios deste modal (além das etapas e do documento, quando exigido)
  const camposObrigatorios = [
    campoStatusAtual(),
    { key: "indicador", label: "Indicador" },
    { key: "un-medida", label: "Unidade de Medida" },
    ...anos.map((a) => ({ key: `meta-indicador-${a}`, label: `Meta Indicador ${a}` })),
    { key: `resultado-indicador-${PERIODO_ATUAL}`, label: `Resultado Indicador ${PERIODO_ATUAL}` },
    ...anos.map((a) => ({ key: `meta-financeira-${a}`, label: `Meta Financeira ${a}` })),
    { key: "plano-acao", label: "Plano de ação" },
  ];

  function handleSave() {
    const resultado = validarMeta(meta, { campos: camposObrigatorios });
    if (!resultado.ok) {
      setAviso(resultado);
      return;
    }
    onSave?.();
  }

  return (
    <div id="popup-container-PG" className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <AvisoValidacao resultado={aviso} onFechar={() => setAviso(null)} />
        {/* Cabeçalho fixo */}
        <div className="popup-header">
          <h2>Editar Dados - Planos gerais</h2>
          <button className="button_close" type="button" onClick={onClose}>
           
                <MdClose />
          
          </button>
        </div>

        {/* Conteúdo rolagem */}
        <div className="popup-content">
          <br />
          <br />

          <div className="destaque">

            <div className="descricao">
              <h1 id="campo_numero">
                {gv("numero")}
              </h1>
              <h1 className="descricao" >
                -
              </h1>
             
              <h3
                id="campo_descricao2">
                {gv("meta")}
              </h3>
            </div>

            <div className="campo">
              <h4 >
                <i className="uil-bullseye"></i>{" "}
                Detalhamento:
              </h4>
              <br />
              <span
                id="campo_objetivo_meta2">
                {gv("detalhamento")}
              </span>
            </div>

          

            <div className="campo">
              <h4 >
                <i className="uil-link" ></i> ODS
                Vinculados:
              </h4>
          
              <span id="campo_ods_meta2" >
              {gv("ods-vinculados")}
              </span>
            </div>


          </div>

          <div>
            <div className="activity-data">
            <div className="campo">
              <label>Indicador:</label>
              <br />
              <br />
              <input
                id="campo_indicador_meta"
                className="campo_input"
                type="text"
                value={gv("indicador")}
                onChange={(e) =>
                  handleChange("indicador", e.target.value)
                }
              />
            </div>

            <div className="campo">
              <label>Unidade de Medida:</label>
              <br />
              <br />
              <input
                id="campo_unidade_medida_meta"
                className="campo_input"
                type="text"
                value={gv("un-medida")}
                onChange={(e) => handleChange("un-medida", e.target.value)}
              />
            </div>
          </div>
        </div>



          <div>
            <h2>Histórico de Status</h2>
            <p>Adicione um documento comprobatório caso o status seja "Concluída" ou um documento de justificativa caso o status seja "Não Contemplada".</p>
          </div>

          {emLinhas(semestres, 4).map((linha) => (
            <div key={linha[0]} className="activity-data" style={{ alignContent: "center" }}>
              {linha.map((s) => (
                <div key={s} className="campo">
                  <label>Status {s}{s === PERIODO_ATUAL ? "*" : ""}:</label>
                  <br />
                  <br />
                  <select
                    className="campo_input"
                    value={gv(`status-${s}`)}
                    onChange={(e) => handleChange(`status-${s}`, e.target.value)}
                    disabled={s !== PERIODO_ATUAL}
                  >
                    <option value="">Selecionar</option>
                    {STATUS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))}

        <EtapasMeta meta={meta} onChangeField={handleChange} atualizarPorcentagem />

        <div className="destaque">
          <h2>Meta do indicador</h2>
          <div className="activity-data" style={{ alignContent: "center" }}>
            {anos.map((a) => (
              <div key={a} className="campo">
                <label>Meta Indicador {a}:</label>
                <br />
                <br />
                <input
                  className="campo_input"
                  value={gv(`meta-indicador-${a}`)}
                  onChange={(e) => handleChange(`meta-indicador-${a}`, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <h2>Resultado do indicador</h2>
        {emLinhas(semestres, 4).map((linha) => (
          <div key={linha[0]} className="activity-data" style={{ alignContent: "center" }}>
            {linha.map((s) => (
              <div key={s} className="campo">
                <label>Resultado Indicador {s}{s === PERIODO_ATUAL ? "*" : ""}:</label>
                <br />
                <br />
                <input
                  className="campo_input"
                  value={gv(`resultado-indicador-${s}`)}
                  onChange={(e) => handleChange(`resultado-indicador-${s}`, e.target.value)}
                  readOnly={s !== PERIODO_ATUAL}
                />
              </div>
            ))}
          </div>
        ))}

        <div className="destaque">
          <h2>Meta Financeira Anual</h2>
          <div className="activity-data" style={{ alignContent: "center" }}>
            {anos.map((a) => (
              <div key={a} className="campo">
                <label>Meta Financeira {a}:</label>
                <br />
                <br />
                <input
                  className="campo_input"
                  value={gv(`meta-financeira-${a}`)}
                  onChange={(e) => handleChange(`meta-financeira-${a}`, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

          


              <div className="activity-data">

            <div className="campo">
              <label>Previsão de Conclusão:</label>
              <br />
              <br />
              <input
                id="campo_data_conclusao_meta2"
                className="campo_input"
                type="date"
                value={normalizeDateInput(gv("data-conclusao"))}
                onChange={(e) => handleChange("data-conclusao", e.target.value)}
              />
            </div>
          </div>


          <br />
          <br />

         <div className="campo">
              <label>Plano de ação:</label>
              <br />
              <br />
              <input
                id="plano_acao"
                className="campo_input"
              
                value={gv("plano-acao")}
                onChange={(e) => handleChange("plano-acao", e.target.value)}
              />
            </div>

         

          <DocumentoComprobatorio
            meta={meta}
            onChangeField={onChangeField}
            uploadParaDrive={uploadParaDrive}
          />

          <div className="activity-data">

           <div className="campo">
              <label>Justificativa de não conclusão:</label>
              <br />
              <br />
              <input
                id="justificativa"
                 className="campo_input"
              
                value={gv("justificativa-nao-conclusao")}
                onChange={(e) => handleChange("justificativa-nao-conclusao", e.target.value)}
              />
            </div>


            




            </div>

             <div className="campo">
              <label>Informações Adicionais:</label>
              <br />
              <br />
              <input
                id="InfosAdd"
                className="campo_input"
              
                value={gv("informacoes-adicionais")}
                onChange={(e) => handleChange("informacoes-adicionais", e.target.value)}
              />
            </div>

            <span>Última Atualização: {gv("data-ultima-atualizacao")}</span>
            <br/>
          
            <span>Responsável: {gv("responsavel-ultima-atualizacao")}</span>
             <br/>
            <br/>

       

          <button
            id="btnsalvar"
            type="button"
            onClick={handleSave}
            className={loading ? "loading" : ""}
            disabled={loading}
          >
            <i className="uil uil-save"> </i>  {loading ? "Salvando..." : "Salvar Alterações"}
          </button>

          {loading && <div className="loader"></div>}
        </div>
      </div>
    </div>
  );
}

// util: normaliza datas para yyyy-mm-dd (input type="date")
function normalizeDateInput(val) {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (Number.isNaN(+d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

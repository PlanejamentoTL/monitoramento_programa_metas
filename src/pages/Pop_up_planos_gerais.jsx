// components/EditPGModal.jsx
import React, { useMemo } from "react";
import { MdClose } from "react-icons/md";
import '../estilos/pop-up.css';



export default function EditPlanosGeraisModal({
  isOpen,
  meta = {},
  loading = false,
  onClose,
  onChangeField,
  onSave,
  onFileSelect
}) {
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

  const map = useMemo(
    () => ({
      Numero: "campo_numero2",
      Meta: "campo_descricao2",
      Objetivo_meta: "campo_objetivo_meta2",
      Detalhamento_meta: "campo_detalhamento_meta2",
      ODS: "campo_ods_meta2",
      Status_2025_1: "campo_status_meta2", // aqui vira <select>
      Indicador: "campo_indicador_meta2",
      Unidade_medida: "campo_unidade_medida2",
      Resultado_indicador_2025_1: "campo_resultado_indicador25_2",
      Resultado_indicador_2025_2: "campo_resultado_indicador25",
      Resultado_indicador_2026_1: "campo_resultado_indicador26_1",
      Resultado_indicador_2026_2: "campo_resultado_indicador26_2",
      Resultado_indicador_2027_1: "campo_resultado_indicador25_1",
      Resultado_indicador_2027_2: "campo_resultado_indicador25_2",
      Resultado_indicador_2028_1: "campo_resultado_indicador26_1_dup",
      Resultado_indicador_2028_2: "campo_resultado_indicador26_2_dup",

      Documento_comprobatorio: "campo_documento_comprobatorio2", // file (não enviado direto para planilha)
      Porcentagem_execucao: "campo_porcentagem_meta2",
      Data_conclusao: "campo_data_conclusao_meta2",

      Tipo_meta: "campo_tipo_meta2",
      Custeio_investimento: "campo_custeio_investimento2",
      Programa: "campo_programa2",
      Funcao: "campo_funcao2",
      Sub_funcao: "campo_sub_funcao2",
      Fonte_orcamentaria: "campo_fonte_orcamentaria2",
      CO_fonte_orcamentaria: "campo_co_fonte_orcamentaria2",
      Projeto_atividade: "campo_projeto_atividade2",
      Meta_estruturante: "campo_meta_houer2",

      Meta_fisica_2026: "campo_meta_fisica26_2",
      Meta_financeira_2026: "campo_meta_financeira26_2",
      Meta_fisica_2027: "campo_meta_fisica27_2",
      Meta_financeira_2027: "campo_meta_financeira27_2",
      Meta_fisica_2028: "campo_meta_fisica28_2",
      Meta_financeira_2028: "campo_meta_financeira28_2",
      Meta_fisica_2029: "campo_meta_fisica29_2",
      Meta_financeira_2029: "campo_meta_financeira29_2",

      Informacoes_adicionais: "campo_informacoes_adicionais2",
      Ultima_atualizacao: "campo_ultima_atualizacao2",
      Responsavel_envio: "campo_responsavel_envio2",
    }),
    []
  );

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
  }

  return (
    <div id="popup-container-PG" className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
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
                {gv("Numero")}
              </h1>
              <h1 className="descricao" >
                -
              </h1>
             
              <h3
                id="campo_descricao2">
                {gv("Meta")}
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
                {gv("Detalhamento")}
              </span>
            </div>

          

            <div className="campo">
              <h4 >
                <i className="uil-link" ></i> ODS
                Vinculados:
              </h4>
          
              <span id="campo_ods_meta2" >
              {gv("ODS")}
              </span>
            </div>
          </div>

          {/* STATUS */}
          <div className="campo">
            <label>Status:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("Status_2025_1")}
              onChange={(e) => handleChange("Status_2025_1", e.target.value)}
            >
              <option value="">Selecionar</option>
              <option value="Concluída">Concluída</option>
              <option value="Em Partes">Em Partes</option>
              <option value="Planejada">Planejada</option>
              <option value="Não Contemplada">Não Contemplada</option>
            </select>

            
          </div>

              <div className="activity-data">
            <div className="campo">
              <label>Porcentagem de Execução:</label>
              <br />
              <br />
              <input
                id="campo_porcentagem_meta2"
                className="campo_input"
                type="text"
                value={gv("Porcentagem_execucao")}
                onChange={(e) =>
                  handleChange("Porcentagem_execucao", e.target.value)
                }
              />
            </div>

            <div className="campo">
              <label>Previsão de Conclusão:</label>
              <br />
              <br />
              <input
                id="campo_data_conclusao_meta2"
                className="campo_input"
                type="date"
                value={normalizeDateInput(gv("Data_conclusao"))}
                onChange={(e) => handleChange("Data_conclusao", e.target.value)}
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
              
                value={gv("plano_acao")}
                onChange={(e) => handleChange("plano_acao", e.target.value)}
              />
            </div>

         

          {/* Documento comprobatório (file) — você pode guardar o nome do arquivo */}
          <div className="campo">
            <label>Documento Comprobatório:</label>
            <br />
            <br />
            <input
  id="campo_documento_comprobatorio2"
  className="campo_input"
  type="file"
  accept=".pdf"
  onChange={(e) => {
    const f = e.target.files?.[0];
    if (f) {
      // dispara o upload pelo Home:
      onFileSelect?.(f, "documentos_comprobatorios"); 
      // (opcional) guardar o nome do arquivo no estado:
      onChangeField?.("Documento_comprobatorio", f.name);
    }
  }}
/>


          </div>

          <div className="activity-data">

           <div className="campo">
              <label>Justificativa de não conclusão:</label>
              <br />
              <br />
              <input
                id="justificativa"
                className="campo_input"
              
                value={gv("justificativa")}
                onChange={(e) => handleChange("justificativa", e.target.value)}
              />
            </div>


            <div className="campo">
            <label>Documento Comprobatório da justificativa:</label>
            <br />
            <br />
            <input
  id="campo_documento_comprobatorio2"
  className="campo_input"
  type="file"
  accept=".pdf"
  onChange={(e) => {
    const f = e.target.files?.[0];
    if (f) {
      // dispara o upload pelo Home:
      onFileSelect?.(f, "documentos_justificativa"); 
      // (opcional) guardar o nome do arquivo no estado:
      onChangeField?.("Documento_comprobatorio", f.name);
    }
  }}
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
              
                value={gv("InfosAdd")}
                onChange={(e) => handleChange("InfosAdd", e.target.value)}
              />
            </div>

       

          <button
            id="btnsalvar"
            type="button"
            onClick={onSave}
            className={loading ? "loading" : ""}
            disabled={loading}
          >
            <i className="uil uil-save"> </i> {loading ? "Salvando..." : "Salvar"}
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

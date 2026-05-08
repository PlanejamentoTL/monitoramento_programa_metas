// components/EditPGModal.jsx
import React, { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import '../estilos/pop-up.css';



export default function EditPlanosGeraisModal({
  isOpen,
  meta = {},
  loading = false,
  onClose,
  onChangeField,
  onSave,
   uploadParaDrive,
}) {

  const [uploading, setLoading] = useState(false);
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
            <h2>Histórico de Status</h2>
            <p>Adicione um documento comprobatório caso o status seja "Concluída" ou um documento de justificativa caso o status seja "Não Contemplada".</p>
          </div>


          <div className="activity-data" style={{ alignContent:"center"}} >

            <div className="campo">
            <label>Status 2025-1:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("status-2025-1")}
              onChange={(e) => handleChange("status-2025-1", e.target.value)}
              disabled
            >
              <option value="">Selecionar</option>
              <option value="Concluída">Concluída</option>
              <option value="Em Partes">Em Partes</option>
              <option value="Planejada">Planejada</option>
              <option value="Não Contemplada">Não Contemplada</option>
            </select>
          </div>

          <div className="campo">
            <label>Status 2025-2:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("status-2025-2")}
              onChange={(e) => handleChange("status-2025-2", e.target.value)}
              disabled
            >
              <option value="">Selecionar</option>
              <option value="Concluída">Concluída</option>
              <option value="Em Partes">Em Partes</option>
              <option value="Planejada">Planejada</option>
              <option value="Não Contemplada">Não Contemplada</option>
            </select>
          </div>

            <div className="campo">
            <label>Status 2026-1*:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("status-2026-1")}
              onChange={(e) => handleChange("status-2026-1", e.target.value)}
            >
              <option value="">Selecionar</option>
              <option value="Concluída">Concluída</option>
              <option value="Em Partes">Em Partes</option>
              <option value="Planejada">Planejada</option>
              <option value="Não Contemplada">Não Contemplada</option>
            </select>
          </div>

          <div className="campo">
            <label>Status 2026-2:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("status-2026-2")}
              onChange={(e) => handleChange("status-2026-2", e.target.value)}
              disabled
            >
              <option value="">Selecionar</option>
              <option value="Concluída">Concluída</option>
              <option value="Em Partes">Em Partes</option>
              <option value="Planejada">Planejada</option>
              <option value="Não Contemplada">Não Contemplada</option>
            </select>
          </div>
        </div>

          <div className="activity-data" style={{ alignContent:"center"}} >

            <div className="campo">
            <label>Status 2027-1:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("status-2027-1")}
              onChange={(e) => handleChange("status-2027-1", e.target.value)}
              disabled
            >
              <option value="">Selecionar</option>
              <option value="Concluída">Concluída</option>
              <option value="Em Partes">Em Partes</option>
              <option value="Planejada">Planejada</option>
              <option value="Não Contemplada">Não Contemplada</option>
            </select>
          </div>

          <div className="campo">
            <label>Status 2027-2:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("status-2027-2")}
              onChange={(e) => handleChange("status-2027-2", e.target.value)}
              disabled
            >
              <option value="">Selecionar</option>
              <option value="Concluída">Concluída</option>
              <option value="Em Partes">Em Partes</option>
              <option value="Planejada">Planejada</option>
              <option value="Não Contemplada">Não Contemplada</option>
            </select>
          </div>

            <div className="campo">
            <label>Status 2028-1:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("status-2028-1")}
              onChange={(e) => handleChange("status-2028-1", e.target.value)}
              disabled
            >
              <option value="">Selecionar</option>
              <option value="Concluída">Concluída</option>
              <option value="Em Partes">Em Partes</option>
              <option value="Planejada">Planejada</option>
              <option value="Não Contemplada">Não Contemplada</option>
            </select>
          </div>

          <div className="campo">
            <label>Status 2028-2:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("status-2028-2")}
              onChange={(e) => handleChange("status-2028-2", e.target.value)}
              disabled
            >
              <option value="">Selecionar</option>
              <option value="Concluída">Concluída</option>
              <option value="Em Partes">Em Partes</option>
              <option value="Planejada">Planejada</option>
              <option value="Não Contemplada">Não Contemplada</option>
            </select>
          </div>


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
                value={gv("porcentagem-execucao")}
                onChange={(e) =>
                  handleChange("porcentagem-execucao", e.target.value)
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

         

          {/* Documento comprobatório (file) — você pode guardar o nome do arquivo */}
          <div className="campo">
            <label>Documento Comprobatório(Adicione apenas 1 documento):</label>
            <br />
            <br />
            <input
  id="campo_documento_comprobatorio2"
  className="campo_input"
  type="file"
  accept=".pdf"
 onChange={async (e) => {
  const f = e.target.files?.[0];
  if (f) {
    setLoading(true); // Ative um spinner
    const resultado = await uploadParaDrive(f);
    
    if (resultado.ok) {
      // Salva o LINK no Firestore através do onChangeField
      onChangeField("documentos-comprobatorios", resultado.url);
      alert("Arquivo salvo no Google Drive!");
    } else {
      alert("Erro no upload para o Drive");
    }
    setLoading(false);
  }
}}
/>

{/* Feedback Visual do Upload */}
  {uploading && (
    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div className="loader" style={{ width: '20px', height: '20px' }}></div> 
      <span style={{ color: '#666', fontSize: '13px' }}>Enviando documento para o Drive...</span>
    </div>
  )}


{/* Dentro do Modal, abaixo do input file */}
{gv("documentos-comprobatorios") && (
  <div style={{ marginTop: '10px', color: 'blue', fontSize: '12px' }}>
    <i className="uil uil-link"></i> Link gerado: 
    <a href={gv("documentos-comprobatorios")} target="_blank" rel="noreferrer"> Visualizar Arquivo</a>
  </div>
)}

          </div>

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
            onClick={onSave}
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

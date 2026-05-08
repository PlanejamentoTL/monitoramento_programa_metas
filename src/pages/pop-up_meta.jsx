import React, { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import "../estilos/pop-up.css";

export default function EditPGModal({
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
    console.log("Dados recebidos no Modal:", meta);

  // Helper para buscar o valor no objeto 'meta'
  const gv = (k) => meta?.[k] ?? "";

  function handleChange(k, v) {
    onChangeField?.(k, v);
  }

  return (
    <div id="popup-container-PG" className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className="popup-header">
          <h2>Editar Dados - Plano de Governo</h2>
          <button className="button_close" type="button" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="popup-content">
          <br />

          {/* Cabeçalho da meta - IDs ajustados para os campos do Firestore */}
          <div className="destaque">
            <div className="activity-data">
              <h1>{gv("numero")}</h1>
              <h1 className="descricao">-</h1>
              <h3>{gv("objetivo")}</h3>
            </div>

            <div className="campo">
              <h4><i className="uil-bullseye"></i> Objetivo:</h4>
              
              <span>{gv("objetivo")}</span>
            </div>

            <div className="campo">
              <h4><i className="uil-link"></i> ODS Vinculados:</h4>
              <span>{gv("ods-vinculados")}</span>
            </div>
          </div>

          {/* STATUS - Semestre 2025.1 */}

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
            <label>Status 2026-1:</label>
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
            <label>Status 2026-1:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("status-2026-2")}
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

          <br />

          {/* Porcentagem e Data */}
          <div className="activity-data">
            <div className="campo">
              <label>Porcentagem de Execução:</label>
              <br />
              <br />
              <input
                className="campo_input"
                type="number"
                value={gv("porcentagem-execucao")}
                onChange={(e) => handleChange("porcentagem-execucao", e.target.value)}
              />
            </div>

            <div className="campo">
              <label>Previsão de Conclusão:</label>
              <br />
              <br />
              <input
                className="campo_input"
                type="date"
                value={normalizeDateInput(gv("data-conclusao"))}
                onChange={(e) => handleChange("data-conclusao", e.target.value)}
              />
            </div>
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

          {/* Justificativa */}
          <div className="activity-data">
            <div className="campo" style={{ width: '100%' }}>
              <label>Justificativa de não conclusão:</label>
              <br />
              <br />
              <input
                className="campo_input"
                value={gv("justificativa-nao-conclusao")}
                onChange={(e) => handleChange("justificativa-nao-conclusao", e.target.value)}
              />
            </div>
          </div>

          {/* Informações adicionais - Agora editável */}
          <div className="campo">
            <label><b>Informações adicionais:</b></label>
            <br />
            <br />
            <textarea
              className="campo_input"
              style={{ width: '100%', minHeight: '60px' }}
              value={gv("informacoes-adicionais")}
              onChange={(e) => handleChange("informacoes-adicionais", e.target.value)}
            />
          </div>

          {/* Última atualização e responsável - Apenas visualização */}
          <div className="activity-data" style={{ fontSize: '13px', marginTop: '10px' }}>
            <div className="campo">
              <label><b>Última atualização:</b></label>
              <span> {gv("data-ultima-atualizacao")}</span>
            </div>

            <div className="campo">
              <label><b> 
                
                Responsável envio:</b></label>
              <span> {gv("responsavel-ultimo-envio")}</span>
            </div>
          </div>

          {/* Botão de salvar */}
          <button
            id="btnsalvar"
            type="button"
            onClick={onSave}
            className={loading ? "loading" : ""}
            disabled={loading}
          >
            <i className="uil uil-save"></i>{" "}
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>

          {loading && <div className="loader"></div>}
        </div>
      </div>
    </div>
  );
}

function normalizeDateInput(val) {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (Number.isNaN(+d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
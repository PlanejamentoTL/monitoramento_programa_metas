// components/EditPGModal.jsx
import React, { useMemo } from "react";
import { MdClose } from "react-icons/md";
import "../estilos/pop-up.css";

export default function EditPGModal({
  isOpen,
  meta = {},
  loading = false,
  onClose,
  onChangeField,
  onSave,
  onFileSelect,
}) {
  if (!isOpen) return null;

  // Helpers
  const gv = (k) => meta?.[k] ?? "";

  const map = useMemo(
    () => ({
      Numero: "campo_numero2",
      Meta: "campo_descricao2",
      Objetivo_meta: "campo_objetivo_meta2",
      Detalhamento_meta: "campo_detalhamento_meta2",
      ODS: "campo_ods_meta2",
      Status_2025_1: "campo_status_meta2",
      Porcentagem_execucao: "campo_porcentagem_meta2",
      Data_conclusao: "campo_data_conclusao_meta2",
      Informacoes_adicionais: "campo_informacoes_adicionais2",
      Ultima_atualizacao: "campo_ultima_atualizacao2",
      Responsavel_envio: "campo_responsavel_envio2",
    }),
    []
  );

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

          {/* Cabeçalho da meta */}
          <div className="destaque">
            <div className="activity-data">
              <h1 id="campo_numero2">{gv("Numero")}</h1>
              <h1 className="descricao">-</h1>
              <h3 id="campo_descricao2">{gv("Objetivo")}</h3>
            </div>

            <div className="campo">
              <h4>
                <i className="uil-bullseye"></i> Metas Vinculadas:
              </h4>
              <br />
              <span id="campo_objetivo_meta2">{gv("metas_vinculadas")}</span>
            </div>

            <div className="campo">
              <h4>
                <i className="uil-link"></i> ODS Vinculados:
              </h4>
              <span id="campo_ods_meta2">{gv("ODS")}</span>
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

          <br />

          {/* Documento comprobatório */}
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
                  onFileSelect?.(f, "documentos_comprobatorios");
                  onChangeField?.("Documento_comprobatorio", f.name);
                }
              }}
            />
          </div>

          {/* Porcentagem e Data */}
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

            

          {/* Informações adicionais */}
          <div className="campo">
            <label>
              <b>Informações adicionais:</b>
            </label>
            <span id="campo_informacoes_adicionais2">
              {gv("Informacoes_adicionais")}
            </span>
          </div>

          {/* Última atualização e responsável */}
          <div className="activity-data">
            <div className="campo">
              <label>
                <b>Última atualização:</b>
              </label>
              <span id="campo_ultima_atualizacao2">
                {gv("Ultima_atualizacao")}
              </span>
            </div>

            <div className="campo">
              <label>
                <b>Responsável envio:</b>
              </label>
              <span id="campo_responsavel_envio2">
                {gv("responsavel_envio")}
              </span>
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
            {loading ? "Salvando..." : "Salvar"}
          </button>

          {loading && <div className="loader"></div>}
        </div>
      </div>
    </div>
  );
}

// Normalizador de datas (para input type="date")
function normalizeDateInput(val) {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (Number.isNaN(+d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

import React, { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import "../estilos/pop-up.css";
import EtapasMeta from "../components/EtapasMeta";
import DocumentoComprobatorio from "../components/DocumentoComprobatorio";
import AvisoValidacao from "../components/AvisoValidacao";
import { validarMeta, campoStatusAtual } from "../utils/validacaoMeta";

export default function EditPGModal({
  isOpen,
  meta = {},
  loading = false,
  onClose,
  onChangeField,
  onSave,
  uploadParaDrive,
}) {

  const [aviso, setAviso] = useState(null);
  if (!isOpen) return null;
    console.log("Dados recebidos no Modal:", meta);

  // Helper para buscar o valor no objeto 'meta'
  const gv = (k) => meta?.[k] ?? "";

  function handleChange(k, v) {
    onChangeField?.(k, v);
  }

  // Campos obrigatórios deste modal (além das etapas e do documento, quando exigido)
  const camposObrigatorios = [
    campoStatusAtual(),
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
            <label>Status 2026-1:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("status-2026-1")}
              onChange={(e) => handleChange("status-2026-1", e.target.value)}
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
            <label>Status 2026-2*:</label>
            <br />
            <br />
            <select
              id="campo_status_meta2"
              className="campo_input"
              value={gv("status-2026-2")}
              onChange={(e) => handleChange("status-2026-2", e.target.value)}
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

          <EtapasMeta meta={meta} onChangeField={handleChange} atualizarPorcentagem />

          <br />

          {/* Porcentagem e Data */}
          <div className="activity-data">

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


          <DocumentoComprobatorio
            meta={meta}
            onChangeField={onChangeField}
            uploadParaDrive={uploadParaDrive}
          />

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
            onClick={handleSave}
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
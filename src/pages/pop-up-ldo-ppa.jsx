import React, { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import "../estilos/pop-up.css";

export default function EditPPALDOModal({
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
          <h2>Editar Dados - LDO</h2>
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
              <h4><i className="uil-bullseye"></i> Detalhamento:</h4>
              
              <span>{gv("detalhamento")}</span>
            </div>

            <div className="campo">
              <h4><i className="uil-bullseye"></i> Objetivo do Plano de Governo Vinculado:</h4>
              
              <span>{gv("objetivo")}</span>
            </div>

            <div className="activity-data" style={{ fontSize: '13px', marginTop: '10px' }}> 

            <div className="campo">
              <h4><i className="uil-link"></i> Indicador:</h4>
              <p>{gv("indicador")}</p>
            </div>
        

            <div className="campo">
              <h4><i className="uil-link"></i> Unidade de medida:</h4>
              <span>{gv("un-medida")}</span>
            </div>
          </div>
         </div>

                  <div>
            <h2>Histórico de Status</h2>
            <p>Adicione um documento comprobatório caso o status seja "Concluída" ou um documento de justificativa caso o status seja "Não Contemplada".</p>
          </div>

          <div className="activity-data" style={{ alignContent:"center"}} > 
          <div className="campo">
            <label>Status 2026-1*:</label>
            <br />
            <br />
            <select
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


             <div className="campo" >
            <label>Status 2026-2:</label>
            <br />
            <br />
            <select
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
            <label>Resultado Indicador 2026-1*:</label>
            <br />
            <br />
            <input
              className="campo_input"
              value={gv("resultado-indicador-2026-1")}
              onChange={(e) => handleChange("resultado-indicador-2026-1", e.target.value)}
          
            />
          </div>

            <div className="campo">
            <label>Resultado Indicador 2026-2:</label>
            <br />
            <br />
            <input
              className="campo_input"
              value={gv("resultado-indicador-2026-2")}
              onChange={(e) => handleChange("resultado-indicador-2026-2", e.target.value)}
              readOnly
          
            />
          </div>


           </div>

      
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


          <div className="destaque">

              <div className="activity-data" style={{ fontSize: '13px', marginTop: '10px' }}>
            <div className="campo">
              <label><b>Tipo Meta:</b></label>
              <span> {gv("tipo-meta")}</span>
            </div>

            <div className="campo">
              <label><b>Custeio/Investimento:</b></label>
              <span> {gv("custeio-investimento")}</span>
            </div>
          </div>


           <div className="activity-data" style={{ fontSize: '13px', marginTop: '10px' }}>
            
            <div className="campo">
              <label><b>Programa:</b></label> <br/>
              <span> {gv("programa")}</span>
            </div>

            <div className="campo">
              <label><b>Projeto Atividade:</b></label> <br/>
              <span> {gv("projeto-atividade")}</span>
            </div>

            <div className="campo">
              <label><b>Função:</b></label> <br/>
              <span> {gv("funcao")}</span>
            </div>
            <div className="campo">
              <label><b>Subfunção:</b></label> <br/>
              <span> {gv("subfuncao")}</span>
            </div>

            <div className="campo">
              <label><b>Meta previamente planejada:</b></label> <br/>
              <span> {gv("meta-previamente-planejada")}</span>
            </div>

           </div>

           <div className="activity-data" style={{ fontSize: '13px', marginTop: '10px' }}>
            
            <div className="campo">
              <label><b>Meta física 2026:</b></label> <br/>
              <span> {gv("meta-fisica-2026")}</span>
            </div>

            <div className="campo">
              <label><b>Meta física 2027:</b></label> <br/>
              <span> {gv("meta-fisica-2027")}</span>
            </div>

            <div className="campo">
              <label><b>Meta física 2028:</b></label> <br/>
              <span> {gv("meta-fisica-2028")}</span>
            </div>
            <div className="campo">
              <label><b>Meta física 2029:</b></label> <br/>
              <span> {gv("meta-fisica-2029")}</span>
            </div>
           </div>

           <div className="activity-data" style={{ fontSize: '13px', marginTop: '10px' }}>
            
            <div className="campo">
              <label><b>Meta financeira 2026:</b></label> <br/>
              <span> {gv("meta-financeira-2026")}</span>
            </div>

            <div className="campo">
              <label><b>Meta financeira 2027:</b></label> <br/>
              <span> {gv("meta-financeira-2027")}</span>
            </div>

            <div className="campo">
              <label><b>Meta financeira 2028:</b></label> <br/>
              <span> {gv("meta-financeira-2028")}</span>
            </div>
            <div className="campo">
              <label><b>Meta financeira 2029:</b></label> <br/>
              <span> {gv("meta-financeira-2029")}</span>
            </div>

            

           </div>

          </div>

         
          <div className="activity-data" style={{ fontSize: '13px', marginTop: '10px' }}>
            <div className="campo">
              <label><b>Última atualização:</b></label>
              <span> {gv("data-ultima-atualizacao")}</span>
            </div>

            <div className="campo">
              <label><b>Responsável envio:</b></label>
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
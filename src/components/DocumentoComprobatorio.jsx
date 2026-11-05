import React, { useState } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaEye } from "react-icons/fa";
import { PERIODO_ATUAL } from "../config/periodoAtual";
import { documentoObrigatorio, documentoPendente, MSG_DOCUMENTO } from "../utils/validacaoMeta";

// Envio do documento comprobatório: input de arquivo, botão para visualizar
// o documento anexado e ícone de situação, alinhados na mesma linha.
// Ícone de alerta quando o status do semestre atual é "Concluída" ou
// "Não Contemplada" (documento obrigatório) e não há documento anexado.
export default function DocumentoComprobatorio({ meta = {}, onChangeField, uploadParaDrive }) {
  const [enviando, setEnviando] = useState(false);

  const link = String(meta?.["documentos-comprobatorios"] ?? "").trim();
  const status = meta?.[`status-${PERIODO_ATUAL}`];
  const alerta = documentoPendente(meta);

  const situacao = alerta
    ? `Status ${PERIODO_ATUAL} "${status}": documento comprobatório obrigatório`
    : link
      ? "Documento comprobatório anexado"
      : "Nenhum documento anexado (não obrigatório para o status atual)";

  async function handleArquivo(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setEnviando(true);
    try {
      const resultado = await uploadParaDrive(f);
      if (resultado?.ok) {
        // Salva o LINK no Firestore através do onChangeField
        onChangeField?.("documentos-comprobatorios", resultado.url);
        alert("Arquivo salvo no Google Drive!");
      } else {
        alert("Erro no upload para o Drive");
      }
    } catch (err) {
      console.error("Erro no upload:", err);
      alert("Erro no upload para o Drive");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="campo">
      <label>
        Documento Comprobatório{documentoObrigatorio(meta) ? "*" : ""} (Adicione apenas 1 documento):
      </label>
      <br />
      <br />

      <div className="documento-linha">
        <input
          id="campo_documento_comprobatorio2"
          className="campo_input"
          type="file"
          accept=".pdf"
          disabled={enviando}
          onChange={handleArquivo}
        />

        <button
          type="button"
          className="btn-visualizar-documento"
          disabled={!link || enviando}
          title={link ? "Abrir o documento anexado" : "Nenhum documento anexado"}
          onClick={() => window.open(link, "_blank", "noopener,noreferrer")}
        >
          <FaEye /> Visualizar documentação anexada
        </button>

        <span
          className={`documento-icone ${alerta ? "documento-icone--alerta" : "documento-icone--ok"}`}
          title={situacao}
          role="img"
          aria-label={situacao}
        >
          {alerta ? <FaExclamationTriangle /> : <FaCheckCircle />}
        </span>
      </div>

      {alerta && (
        <small className="documento-aviso">
          {MSG_DOCUMENTO} (obrigatório para o status "{status}").
        </small>
      )}

      {enviando && (
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="loader" style={{ width: "20px", height: "20px" }}></div>
          <span style={{ color: "#666", fontSize: "13px" }}>Enviando documento para o Drive...</span>
        </div>
      )}
    </div>
  );
}

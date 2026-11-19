import React, { useState } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaEye, FaTrashAlt } from "react-icons/fa";
import { PERIODO_ATUAL } from "../config/periodoAtual";
import { documentoObrigatorio, documentoPendente, MSG_DOCUMENTO } from "../utils/validacaoMeta";

// Envio do documento comprobatório: input de arquivo, botão para visualizar
// o documento anexado e ícone de situação, alinhados na mesma linha.
// Ícone de alerta quando o status do semestre atual é "Concluída" ou
// "Não Contemplada" (documento obrigatório) e não há documento anexado.
export default function DocumentoComprobatorio({ meta = {}, onChangeField, uploadParaDrive }) {
  const [enviando, setEnviando] = useState(false);
  // Muda a key do input de arquivo para limpá-lo (permite reenviar o mesmo arquivo)
  const [inputKey, setInputKey] = useState(0);

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

  // Remove o vínculo do documento com a meta (gravado ao clicar em Salvar).
  // O arquivo continua no Google Drive.
  function handleExcluir() {
    if (!link) return;
    if (!window.confirm("Excluir o documento comprobatório anexado a esta meta?")) return;
    onChangeField?.("documentos-comprobatorios", "");
    setInputKey((k) => k + 1);
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
          key={inputKey}
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

        <button
          type="button"
          className="btn-excluir-documento"
          disabled={!link || enviando}
          title={link ? "Excluir o documento anexado" : "Nenhum documento anexado"}
          aria-label="Excluir o documento anexado"
          onClick={handleExcluir}
        >
          <FaTrashAlt />
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
          {`${MSG_DOCUMENTO} (obrigatório para o status "${status}").`}
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

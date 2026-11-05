import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { MSG_DOCUMENTO } from "../utils/validacaoMeta";

// Aviso exibido sobre o modal quando há pendências ao clicar em "Salvar Alterações".
// resultado: retorno de validarMeta()
export default function AvisoValidacao({ resultado, onFechar }) {
  if (!resultado || resultado.ok) return null;
  const { documento, faltando, datasInvalidas } = resultado;

  return (
    <div className="aviso-overlay" onClick={(e) => { e.stopPropagation(); onFechar?.(); }}>
      <div
        className="aviso-caixa"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="aviso-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <FaExclamationTriangle className="aviso-icone" aria-hidden="true" />

        {documento && (
          <h3 id="aviso-titulo" className="aviso-titulo">{MSG_DOCUMENTO}</h3>
        )}

        {faltando.length > 0 && (
          <>
            <p id={documento ? undefined : "aviso-titulo"} className="aviso-subtitulo">
              Preencha os campos obrigatórios:
            </p>
            <ul className="aviso-lista">
              {faltando.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </>
        )}

        {datasInvalidas.length > 0 && (
          <p className="aviso-subtitulo">
            Previsão inválida na(s) etapa(s) {datasInvalidas.join(", ")}. Use dd/mm/aaaa
            com uma data existente.
          </p>
        )}

        <button type="button" className="aviso-botao" onClick={onFechar} autoFocus>
          OK
        </button>
      </div>
    </div>
  );
}

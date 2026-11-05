import React, { useState } from "react";
import {
  NUMEROS_ETAPAS,
  STATUS_ETAPA,
  CORES_STATUS,
  campoEtapa,
  previsaoParaISO,
  previsaoParaBR,
  mascaraData,
  formatarPeso,
  calcularPorcentagemExecucao,
} from "../utils/etapas";

// Campo de data no formato brasileiro (dd/mm/aaaa).
// Repassa ao pai o valor em ISO (AAAA-MM-DD) quando a data é válida,
// "" quando vazio, ou o texto digitado enquanto incompleto/inválido
// (o handleSave do modal bloqueia a gravação nesse caso).
function CampoPrevisao({ id, valor, onChange }) {
  const [tocado, setTocado] = useState(false);
  const texto = previsaoParaBR(valor);
  const invalida = previsaoParaISO(valor) === null;
  const mostrarErro = invalida && (tocado || texto.length >= 10);

  function handleInput(e) {
    const mascarado = mascaraData(e.target.value);
    if (!mascarado) return onChange("");
    const iso = mascarado.length === 10 ? previsaoParaISO(mascarado) : null;
    onChange(iso || mascarado);
  }

  return (
    <>
      <input
        id={id}
        className={`campo_input${mostrarErro ? " etapa-input-erro" : ""}`}
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/aaaa"
        maxLength={10}
        value={texto}
        onChange={handleInput}
        onBlur={() => setTocado(true)}
      />
      {mostrarErro && <small className="etapa-erro">Data inválida (dd/mm/aaaa)</small>}
    </>
  );
}

// atualizarPorcentagem: quando true, ao mudar o status de uma etapa recalcula
// "porcentagem-execucao" como a soma dos pesos das etapas "Concluída".
export default function EtapasMeta({ meta = {}, onChangeField, atualizarPorcentagem = false }) {
  const gv = (k) => meta?.[k] ?? "";

  function handleStatus(kStatus, valor) {
    onChangeField?.(kStatus, valor);
    if (atualizarPorcentagem) {
      onChangeField?.(
        "porcentagem-execucao",
        calcularPorcentagemExecucao({ ...meta, [kStatus]: valor })
      );
    }
  }

  return (
    <div className="etapas-meta">
      <div className="etapas-cabecalho">
        <h2>Etapas da Meta</h2>
        {atualizarPorcentagem && (
          <div
            className="etapas-porcentagem"
            title="Calculada automaticamente pela soma dos pesos das etapas concluídas"
          >
            <strong>{formatarPeso(gv("porcentagem-execucao") || "0")}</strong>
            <small>Porcentagem de Conclusão</small>
          </div>
        )}
      </div>

      {NUMEROS_ETAPAS.map((n) => {
        const kDescricao = campoEtapa("descricao", n);
        const kPeso = campoEtapa("peso", n);
        const kPrevisao = campoEtapa("previsao", n);
        const kStatus = campoEtapa("status", n);
        const status = gv(kStatus);

        return (
          <div className="etapa-card" key={n}>
            <h3 className="etapa-titulo">Etapa {n}</h3>

            <div className="etapa-campos">
              <div className="etapa-campo etapa-descricao">
                <label>Descrição:</label>
                <span>{gv(kDescricao) || "—"}</span>
              </div>

              <div className="etapa-campo etapa-peso">
                <label>Peso:</label>
                <span>{formatarPeso(gv(kPeso))}</span>
              </div>

              <div className="etapa-campo">
                <label htmlFor={`previsao-etapa${n}`}>Previsão:</label>
                <CampoPrevisao
                  id={`previsao-etapa${n}`}
                  valor={gv(kPrevisao)}
                  onChange={(v) => onChangeField?.(kPrevisao, v)}
                />
              </div>

              <div className="etapa-campo">
                <label htmlFor={`status-etapa${n}`}>Status:</label>
                <select
                  id={`status-etapa${n}`}
                  className="campo_input"
                  style={CORES_STATUS[status] ? { background: CORES_STATUS[status] } : undefined}
                  value={STATUS_ETAPA.includes(status) ? status : ""}
                  onChange={(e) => handleStatus(kStatus, e.target.value)}
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {STATUS_ETAPA.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

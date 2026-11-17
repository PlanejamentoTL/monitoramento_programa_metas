import React, { useEffect, useState } from "react";
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
  CAMPO_TIPO_META,
  TIPOS_META,
  TRACO,
  ehContinuidade,
} from "../utils/etapas";

// Campo de data no formato brasileiro (dd/mm/aaaa).
// Repassa ao pai o valor em ISO (AAAA-MM-DD) quando a data é válida,
// "" quando vazio, ou o texto digitado enquanto incompleto/inválido
// (o handleSave do modal bloqueia a gravação nesse caso).
function CampoPrevisao({ id, valor, onChange, disabled = false }) {
  const [tocado, setTocado] = useState(false);
  const texto = previsaoParaBR(valor);
  const invalida = previsaoParaISO(valor) === null;
  const mostrarErro = !disabled && invalida && (tocado || texto.length >= 10);

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
        disabled={disabled}
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

  const continuidade = ehContinuidade(meta);

  // Em metas de continuidade, previsão e status de todas as etapas devem ser "-"
  // (também corrige metas que já estavam como Continuidade ao abrir o modal)
  useEffect(() => {
    if (!continuidade) return;
    NUMEROS_ETAPAS.forEach((n) => {
      ["previsao", "status"].forEach((tipo) => {
        const k = campoEtapa(tipo, n);
        if (meta?.[k] !== TRACO) onChangeField?.(k, TRACO);
      });
    });
    if (atualizarPorcentagem && String(meta?.["porcentagem-execucao"] ?? "") !== "0") {
      onChangeField?.("porcentagem-execucao", "0");
    }
  }, [continuidade, meta, onChangeField, atualizarPorcentagem]);

  function handleTipo(valor) {
    onChangeField?.(CAMPO_TIPO_META, valor);
    // Voltou para Investimento: limpa os "-" para as etapas serem preenchidas
    if (valor.toLowerCase() !== "continuidade") {
      const novo = { ...meta, [CAMPO_TIPO_META]: valor };
      NUMEROS_ETAPAS.forEach((n) => {
        ["previsao", "status"].forEach((tipo) => {
          const k = campoEtapa(tipo, n);
          if (meta?.[k] === TRACO) {
            onChangeField?.(k, "");
            novo[k] = "";
          }
        });
      });
      if (atualizarPorcentagem) {
        onChangeField?.("porcentagem-execucao", calcularPorcentagemExecucao(novo));
      }
    }
  }

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

      <div className="campo etapas-tipo">
        <label htmlFor="investimento-continuidade">Investimento / Continuidade*:</label>
        <select
          id="investimento-continuidade"
          className="campo_input"
          value={TIPOS_META.find((t) => t.toLowerCase() === String(gv(CAMPO_TIPO_META)).trim().toLowerCase()) || ""}
          onChange={(e) => handleTipo(e.target.value)}
        >
          <option value="" disabled>
            Selecione...
          </option>
          {TIPOS_META.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div
        className={continuidade ? "etapas-lista etapas-lista--inativa" : "etapas-lista"}
        aria-disabled={continuidade || undefined}
      >
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
                  disabled={continuidade}
                />
              </div>

              <div className="etapa-campo">
                <label htmlFor={`status-etapa${n}`}>Status:</label>
                <select
                  id={`status-etapa${n}`}
                  className="campo_input"
                  style={CORES_STATUS[status] ? { background: CORES_STATUS[status] } : undefined}
                  value={STATUS_ETAPA.includes(status) || status === TRACO ? status : ""}
                  onChange={(e) => handleStatus(kStatus, e.target.value)}
                  disabled={continuidade}
                >
                  {continuidade && <option value={TRACO}>{TRACO}</option>}
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
    </div>
  );
}

import React, { useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "../estilos/PainelMetas.css";
import { PERIODO_ATUAL } from "../config/periodoAtual";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const STATUS = ["Concluída", "Em Partes", "Planejada", "Não Contemplada"];
const SEM_STATUS = "Sem status";

// Semestres disponíveis no plano (campos "status-AAAA-S"), em ordem e até o período atual
function semestresDoPlano(rows) {
  const set = new Set();
  rows.forEach((r) =>
    Object.keys(r).forEach((k) => {
      const m = k.match(/^status-(\d{4}-[12])$/);
      if (m) set.add(m[1]);
    })
  );
  return [...set].sort().filter((p) => p <= PERIODO_ATUAL);
}

export default function PainelMetas({ rows = [] }) {
  // Contagem por status
const statusCount = useMemo(() => {
    const map = {
      "Concluída": 0,
      "Em Partes": 0,
      "Planejada": 0,
      "Não Contemplada": 0,
      [SEM_STATUS]: 0,
    };
    rows.forEach((r) => {
      const s = String(r[`status-${PERIODO_ATUAL}`] ?? "").trim();
      map[STATUS.includes(s) ? s : SEM_STATUS]++;
    });
    return map;
  }, [rows]);

  const total = rows.length;
  const colors = {
    "Concluída": "#4CAF50",
    "Em Partes": "#0060a3",
    "Planejada": "#ffff00",
    "Não Contemplada": "#ea4335",
    [SEM_STATUS]: "#c9c9c9",
  };

  const chartData = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        data: Object.values(statusCount),
        backgroundColor: Object.keys(statusCount).map((s) => colors[s]),
        borderWidth: 1,
        cutout: "70%",
      },
    ],
  };

  // Evolução: quantidade de metas em cada status, por semestre
  const evolucao = useMemo(() => {
    const semestres = semestresDoPlano(rows);
    const contagem = semestres.map((p) => {
      const c = Object.fromEntries([...STATUS, SEM_STATUS].map((s) => [s, 0]));
      rows.forEach((r) => {
        const s = String(r[`status-${p}`] ?? "").trim();
        c[STATUS.includes(s) ? s : SEM_STATUS]++;
      });
      return c;
    });
    return { semestres, contagem };
  }, [rows]);

  const barData = {
    labels: evolucao.semestres,
    datasets: [...STATUS, SEM_STATUS].map((s) => ({
      label: s,
      data: evolucao.contagem.map((c) => c[s]),
      backgroundColor: colors[s],
      borderColor: "#fff",
      borderWidth: { top: 2 },
      borderSkipped: "bottom",
      maxBarThickness: 48,
    })),
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: { precision: 0 },
        grid: { color: "rgba(0,0,0,0.06)" },
        title: { display: true, text: "Quantidade de metas" },
      },
    },
    plugins: {
      legend: { position: "bottom" },
      datalabels: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y;
            const pct = total ? ((v / total) * 100).toFixed(1) : "0.0";
            return ` ${ctx.dataset.label}: ${v} (${pct}%)`;
          },
        },
      },
    },
  };

  const chartOptions = {
    plugins: {
      legend: { position: "bottom" },
      datalabels: {
        color: "#000",
        formatter: (value, ctx) => {
          const total = ctx.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const pct = ((value / total) * 100).toFixed(1);
          return value > 0 ? `${pct}%` : "";
        },
      },
    },
  };

  return (
    <div className="painel-metas">
      <h3>Painel de Monitoramento</h3>

      <div className="bento-grid">
        {/* Gráfico */}
        <div className="bento-card"  style={{ gridArea: "box-1" }} >
          <div className="grafico-status">
          <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Contadores */}
        <div className="bento-card" style={{ gridArea: "box-2" }} >
          <h4>Total de Metas</h4>
          <p className="contador">{total}</p>
        </div>
        <div className="bento-card" style={{ gridArea: "box-3" }} >
          <h4>Concluídas</h4>
          <p className="contador">{statusCount["Concluída"]}</p>
        </div>
        <div className="bento-card" style={{ gridArea: "box-4" }} >
          <h4>Em Partes</h4>
          <p className="contador">{statusCount["Em Partes"]}</p>
        </div>
        <div className="bento-card" style={{ gridArea: "box-5" }} >
          <h4>Planejadas</h4>
          <p className="contador">{statusCount["Planejada"]}</p>
        </div>
        <div className="bento-card "  style={{ gridArea: "box-6" }}>
          <h4>Não Contempladas</h4>
          <p className="contador">{statusCount["Não Contemplada"]}</p>
        </div>
        <div className="bento-card" style={{ gridArea: "box-8" }}>
          <h4>Sem status</h4>
          <p className="contador">{statusCount[SEM_STATUS]}</p>
        </div>

        {/* Evolução dos status por semestre */}
        <div className="bento-card bento-card-estatico" style={{ gridArea: "box-7" }}>
          <h4>Evolução dos status por semestre</h4>
          {evolucao.semestres.length ? (
            <div className="grafico-evolucao">
              <Bar data={barData} options={barOptions} />
            </div>
          ) : (
            <p>Sem semestres com status para exibir.</p>
          )}
        </div>
      </div>
    </div>
  );
}

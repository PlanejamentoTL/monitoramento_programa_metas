import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "../estilos/PainelMetas.css";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function PainelMetas({ rows = [] }) {
  // Contagem por status
  const statusCount = useMemo(() => {
    const map = {
      "Concluída": 0,
      "Em Partes": 0,
      "Planejada": 0,
      "Não Contemplada": 0,
    };
    rows.forEach((r) => {
      const s = (r.Status_2025_1 || "").trim();
      if (map.hasOwnProperty(s)) map[s]++;
    });
    return map;
  }, [rows]);

  const total = rows.length;
  const colors = {
    "Concluída": "#4CAF50",
    "Em Partes": "#0060a3",
    "Planejada": "#ffff00",
    "Não Contemplada": "#ea4335",
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
      </div>
    </div>
  );
}

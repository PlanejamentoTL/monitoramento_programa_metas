// Desenha os gráficos fora da tela e devolve PNG (base64) para inserir no .docx
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip,
  DoughnutController,
  BarController,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { PERIODO_ATUAL } from "../config/periodoAtual";
import { CATEGORIAS, CORES_GRAFICO, SEM_STATUS, contarStatus, evolucaoStatus } from "./estatisticasStatus";

Chart.register(
  ArcElement, BarElement, CategoryScale, LinearScale, Legend, Title, Tooltip,
  DoughnutController, BarController, ChartDataLabels
);

// Texto escuro sobre cores claras (amarelo e cinza)
const corTexto = (categoria) =>
  categoria === "Planejada" || categoria === SEM_STATUS ? "#222" : "#fff";

// Pinta o fundo de branco (o canvas é transparente por padrão)
const fundoBranco = {
  id: "fundoBranco",
  beforeDraw(chart) {
    const { ctx, width, height } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  },
};

// Tamanho de desenho (px CSS). Proporção igual à da imagem no Word (17 x 11 cm).
const LARGURA = 850;
const ALTURA = 550;
export const TAMANHO_CM = { width: 17, height: 11 };

const FONTE = { family: "Arial, Helvetica, sans-serif" };

function renderizar(config) {
  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:-10000px;top:0;width:${LARGURA}px;height:${ALTURA}px;`;
  const canvas = document.createElement("canvas");
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  host.appendChild(canvas);
  document.body.appendChild(host);

  const chart = new Chart(canvas, {
    ...config,
    options: {
      ...config.options,
      responsive: false,
      animation: false,
      devicePixelRatio: 2, // imagem em alta resolução para impressão
    },
    plugins: [...(config.plugins || []), fundoBranco],
  });
  try {
    const dataUrl = chart.toBase64Image("image/png");
    return dataUrl.slice(dataUrl.indexOf(",") + 1);
  } finally {
    chart.destroy();
    host.remove();
  }
}

export function graficoRoscaPNG(rows) {
  const contagem = contarStatus(rows, PERIODO_ATUAL);
  const total = rows.length;

  return renderizar({
    type: "doughnut",
    data: {
      labels: CATEGORIAS,
      datasets: [{
        data: CATEGORIAS.map((s) => contagem[s]),
        backgroundColor: CATEGORIAS.map((s) => CORES_GRAFICO[s]),
        borderColor: "#fff",
        borderWidth: 2,
      }],
    },
    options: {
      cutout: "75%", // espaço interno (furo) da rosca
      layout: { padding: 10 },
      plugins: {
        title: {
          display: true,
          text: `Status das metas - ${PERIODO_ATUAL} (total: ${total})`,
          font: { ...FONTE, size: 22, weight: "bold" },
          color: "#121212",
        },
        legend: {
          position: "right",
          labels: { font: { ...FONTE, size: 18 }, color: "#121212", padding: 16 },
        },
        tooltip: { enabled: false },
        datalabels: {
          display: (ctx) => ctx.dataset.data[ctx.dataIndex] > 0,
          color: (ctx) => corTexto(CATEGORIAS[ctx.dataIndex]),
          font: { ...FONTE, size: 18, weight: "bold" },
          textAlign: "center",
          formatter: (v) => `${v}\n${total ? ((v / total) * 100).toFixed(1) : "0.0"}%`,
        },
      },
    },
  });
}

export function graficoEvolucaoPNG(rows) {
  const { semestres, contagem } = evolucaoStatus(rows);

  return renderizar({
    type: "bar",
    data: {
      labels: semestres,
      datasets: CATEGORIAS.map((s) => ({
        label: s,
        data: contagem.map((c) => c[s]),
        backgroundColor: CORES_GRAFICO[s],
        borderColor: "#fff",
        borderWidth: { top: 2 },
        borderSkipped: "bottom",
        maxBarThickness: 90,
      })),
    },
    options: {
      layout: { padding: 10 },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { font: { ...FONTE, size: 18 }, color: "#121212" },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: { precision: 0, font: { ...FONTE, size: 16 }, color: "#121212" },
          grid: { color: "rgba(0,0,0,0.08)" },
          title: { display: true, text: "Quantidade de metas", font: { ...FONTE, size: 18 }, color: "#121212" },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Evolução dos status por semestre",
          font: { ...FONTE, size: 22, weight: "bold" },
          color: "#121212",
        },
        legend: {
          position: "bottom",
          labels: { font: { ...FONTE, size: 18 }, color: "#121212", padding: 16 },
        },
        tooltip: { enabled: false },
        // No papel não há tooltip: mostra a quantidade dentro de cada segmento
        datalabels: {
          display: (ctx) => ctx.dataset.data[ctx.dataIndex] > 0,
          color: (ctx) => corTexto(ctx.dataset.label),
          font: { ...FONTE, size: 16, weight: "bold" },
        },
      },
    },
  });
}

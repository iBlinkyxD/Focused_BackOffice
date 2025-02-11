import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { useTranslation } from "react-i18next";

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Lv. 1", "Lv. 2", "Lv. 3", "Lv. 4"], // Initial labels (dynamic update below)
        datasets: [
          {
            label: t("pieChart.flashcardLabel"),
            data: [
              data.Level_1,
              data.Level_2,
              data.Level_3,
              data.Level_4,
            ],
            backgroundColor: [
              "rgba(60, 162, 162, 1)",
              "rgba(33, 90, 109, 1)",
              "rgba(255, 153, 21, 1)",
              "rgba(250, 217, 40, 1)",
            ],
            borderColor: [
              "rgba(60, 162, 162, 1)",
              "rgba(33, 90, 109, 1)",
              "rgba(255, 153, 21, 1)",
              "rgba(250, 217, 40, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "left",
          },
          title: {
            display: true,
            text: t("pieChart.flashcardTitle"),
            color: "#215A6D",
            font: {
              size: 24,
              weight: 600,
              family: "Inter",
            },
          },
        },
      },
    });

    // Cleanup to destroy the chart when the component unmounts
    return () => {
      chartInstance.current.destroy();
    };
  }, []); // Initialize chart only once

  useEffect(() => {
    if (chartInstance.current) {
      // Update translations for labels and title
      chartInstance.current.options.plugins.title.text = t(
        "pieChart.flashcardTitle"
      );
      chartInstance.current.data.datasets[0].label = t(
        "pieChart.flashcardLabel"
      );

      chartInstance.current.update(); // Refresh chart for translation changes
    }
  }, [t, i18n.language]); // Trigger when translations or language changes

  useEffect(() => {
    if (chartInstance.current) {
      // Update chart data
      chartInstance.current.data.datasets[0].data = [
        data.Level_1 || 0,
        data.Level_2 || 0,
        data.Level_3 || 0,
        data.Level_4 || 0,
      ];
      chartInstance.current.update(); // Refresh chart for data changes
    }
  }, [data]); // Trigger when data changes

  return <canvas ref={chartRef}></canvas>;
};

export default PieChart;

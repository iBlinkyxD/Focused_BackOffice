import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Chart } from "chart.js/auto";
import { useTranslation } from "react-i18next";

const FlashCardPieChart = forwardRef(({ data }, ref) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Lv. 1", "Lv. 2", "Lv. 3", "Lv. 4"],
        datasets: [
          {
            label: t("pieChart.flashcardLabel"),
            data: [data.Level_1, data.Level_2, data.Level_3, data.Level_4],
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
        maintainAspectRatio: true,
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

    return () => {
      chartInstanceRef.current.destroy();
    };
  }, []); // Initialize the chart once

  useEffect(() => {
    if (chartInstanceRef.current) {
      // Update chart translations
      chartInstanceRef.current.options.plugins.title.text = t(
        "pieChart.flashcardTitle"
      );
      chartInstanceRef.current.data.datasets[0].label = t(
        "pieChart.flashcardLabel"
      );
      chartInstanceRef.current.update();
    }
  }, [t, i18n.language]); // Trigger when translations or language change

  useEffect(() => {
    if (chartInstanceRef.current) {
      // Update the chart data
      chartInstanceRef.current.data.datasets[0].data = [
        data.Level_1 || 0,
        data.Level_2 || 0,
        data.Level_3 || 0,
        data.Level_4 || 0,
      ];
      chartInstanceRef.current.update(); // Refresh the chart
    }
  }, [data]); // Trigger when data changes

  // Expose chart instance and data to parent
  useImperativeHandle(ref, () => ({
    exportToImage: () => chartInstanceRef.current.toBase64Image("image/png", 1.0),
    getChartData: () => chartInstanceRef.current.data,
    getLabels: () => chartInstanceRef.current.data.labels,
    getDatasetValues: () =>
      chartInstanceRef.current.data.datasets.map((dataset) => dataset.data),
  }));

  return <canvas ref={chartRef} />;
});

export default FlashCardPieChart;

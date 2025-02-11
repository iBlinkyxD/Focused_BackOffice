import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { useTranslation } from "react-i18next";

const ToDoPieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Initialize the chart
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          t("pieChart.done"),
          t("pieChart.notDone"),
          t("pieChart.onTime"),
          t("pieChart.outOfTime"),
        ],
        datasets: [
          {
            label: t("pieChart.toDoLabel"),
            data: [
              data.completed,
              data.not_completed,
              data.completed_within_time,
              data.completed_outside_time,
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
            text: t("pieChart.ToDoTitle"),
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
  }, []); // Initialize the chart only once

  useEffect(() => {
    if (chartInstance.current) {
      // Update translations for labels and title
      chartInstance.current.data.labels = [
        t("pieChart.done"),
        t("pieChart.notDone"),
        t("pieChart.onTime"),
        t("pieChart.outOfTime"),
      ];
      chartInstance.current.options.plugins.title.text = t(
        "pieChart.ToDoTitle"
      );
      chartInstance.current.data.datasets[0].label = t("pieChart.toDoLabel");

      chartInstance.current.update(); // Refresh the chart to reflect changes
    }
  }, [t, i18n.language]); // Trigger when translations or language changes

  useEffect(() => {
    if (chartInstance.current) {
      // Update the chart data
      chartInstance.current.data.datasets[0].data = [
        data.completed || 0,
        data.not_completed || 0,
        data.completed_within_time || 0,
        data.completed_outside_time || 0,
      ];
      chartInstance.current.update(); // Refresh the chart
    }
  }, [data]); // Trigger when data changes

  return <canvas ref={chartRef}></canvas>;
};

export default ToDoPieChart;

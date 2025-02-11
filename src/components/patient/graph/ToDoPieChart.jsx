import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Chart } from "chart.js/auto";
import { useTranslation } from "react-i18next";

const ToDoPieChart = forwardRef(({ data }, ref) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    chartInstanceRef.current = new Chart(ctx, {
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
        maintainAspectRatio: true,
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

    return () => {
      chartInstanceRef.current.destroy();
    };
  }, []); // Initialize the chart once

  useEffect(() => {
    if (chartInstanceRef.current) {
      // Update chart translations
      chartInstanceRef.current.data.labels = [
        t("pieChart.done"),
        t("pieChart.notDone"),
        t("pieChart.onTime"),
        t("pieChart.outOfTime"),
      ];
      chartInstanceRef.current.options.plugins.title.text = t(
        "pieChart.ToDoTitle"
      );
      chartInstanceRef.current.data.datasets[0].label = t("pieChart.toDoLabel");
      chartInstanceRef.current.update();
    }
  }, [t, i18n.language]); // Trigger when translations or language change

  useEffect(() => {
    if (chartInstanceRef.current) {
      // Update the chart data
      chartInstanceRef.current.data.datasets[0].data = [
        data.completed || 0,
        data.not_completed || 0,
        data.completed_within_time || 0,
        data.completed_outside_time || 0,
      ];
      chartInstanceRef.current.update(); // Refresh the chart
    }
  }, [data]); // Trigger when data changes

  // Expose chart instance to parent
  useImperativeHandle(ref, () => ({
    exportToImage: () =>
      chartInstanceRef.current.toBase64Image("image/png", 1.0),
    getChartData: () => chartInstanceRef.current.data,
    getLabels: () => chartInstanceRef.current.data.labels,
    getDatasetValues: () =>
      chartInstanceRef.current.data.datasets.map((dataset) => dataset.data),
  }));

  return <canvas ref={chartRef} width={"400px"} height={"300px"} />;
});

export default ToDoPieChart;

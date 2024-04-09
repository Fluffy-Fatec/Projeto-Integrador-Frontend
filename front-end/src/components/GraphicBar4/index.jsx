import React from "react";
import { Chart } from "react-google-charts";

const data = [
  [
    { type: "date", label: "Month" }, // Alteração do rótulo do eixo X
    "Positive",
    "Negative",
  ],
  [new Date(2014, 0), -0.5, 5.7],
  [new Date(2014, 1), 0.4, 8.7],
  [new Date(2014, 2), 0.5, 12],
  [new Date(2014, 3), 2.9, 15.3],
  [new Date(2014, 4), 6.3, 18.6],
  [new Date(2014, 5), 9, 20.9],
  [new Date(2014, 6), 10.6, 19.8],
  [new Date(2014, 7), 10.3, 16.6],
  [new Date(2014, 8), 7.4, 13.3],
  [new Date(2014, 9), 4.4, 9.9],
  [new Date(2014, 10), 1.1, 6.6],
  [new Date(2014, 11), -0.2, 4.5],
];

const options = {
  chart: {
    title: "Sentiment Over Time",
  },
  width: 675,
  height: 300,
  series: {
    // Gives each series an axis name that matches the Y-axis below.
    0: { axis: "Temps" },
    1: { axis: "Daylight" },
  },
  axes: {
    // Adds labels to each axis; they don't have to match the axis names.
    x: {
      // Alterar o rótulo do eixo X para "Month"
      label: "Month"
    },
    y: {
      Temps: { label: "Cont Message" }, // Renomeie o eixo Y para "Cont Message"
      Daylight: { label: "Cont Message" }, // Renomeie o eixo Y para "Cont Message"
    },
  },
  legend: { position: 'bottom' }
};

export default function App() {
  return (
    <Chart
      chartType="Line"
      width="100%"
      height="100%"
      data={data}
      options={options}
    />
  );
}

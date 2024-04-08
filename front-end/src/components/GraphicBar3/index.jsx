import React from "react";
import { Chart } from "react-google-charts";

const data = [
  ["Mês", "MG", "PR", "RJ", "RS", "SP"],
  ["Janeiro", 1000, 400, 200, 400, 200],
  ["Fevereiro", 1170, 460, 250, 400, 200],
  ["Março", 660, 1120, 300, 400, 200],
  ["Abril", 1030, 540, 350, 400, 200],
];

const options = {
  chart: {
    title: "Sentiment Over Time by State",
  },
  colors: ["#11BF4E", "#F25774", "#FF7131", "#3C5AB7", "#6D83C9"] 
};

function App() {
  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="100%"
      data={data}
      options={options}
    />
  );
}

export default App;

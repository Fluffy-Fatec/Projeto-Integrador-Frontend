import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";

function App() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/graphics/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          limit: 100
        }
      });

      const counts = {};

      // Agrupar os comentários por semana
      response.data.forEach(item => {
        const weekNumber = getWeekNumber(new Date(item.reviewCreationDate));
        if (!counts[weekNumber]) {
          counts[weekNumber] = { 'Positive': 0, 'Negative': 0 };
        }

        if (item.sentimentoPredito === '1') {
          counts[weekNumber]['Positive']++;
        } else if (item.sentimentoPredito === '0') {
          counts[weekNumber]['Negative']++;
        }
      });

      // Converter os dados para o formato esperado pelo gráfico
      const chartData = [['Week', 'Positive', 'Negative']];
      Object.keys(counts).forEach(weekNumber => {
        chartData.push([`Week ${weekNumber}`, counts[weekNumber]['Positive'], counts[weekNumber]['Negative']]);
      });

      setChartData(chartData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setError('Erro ao buscar dados da API.');
      setLoading(false);
    }
  };

  // Função para obter o número da semana a partir de uma data
  const getWeekNumber = (date) => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil((((date - oneJan) / millisecsInDay) + oneJan.getDay() + 1) / 7);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      fetchData(token);
    } else {
      setError('Token de autenticação não encontrado.');
      setLoading(false);
    }
  }, []);

  const options = {
    title: "Sentiment Over Time",
    hAxis: { title: "Week", titleTextStyle: { color: "#333" } },
    vAxis: { title: "Comments", minValue: 0 },
    chartArea: { width: "50%", height: "70%" },
    colors: ["#11BF4E", "#F25774"],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Chart
      chartType="AreaChart"
      width="100%"
      height="100%"
      data={chartData}
      options={options}
    />
  );
}

export default App;

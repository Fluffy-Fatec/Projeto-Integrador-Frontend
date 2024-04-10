import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';

export function App() {
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
      console.log('Dados da API:', response.data);

      // Contar quantos registros existem para cada estado
      const stateCounts = {};
      response.data.forEach(item => {
        const state = item.geolocationState;
        stateCounts[state] = (stateCounts[state] || 0) + 1;
      });

      // Selecionar os cinco estados com maior contagem de registros
      const topStates = Object.keys(stateCounts)
        .sort((a, b) => stateCounts[b] - stateCounts[a])
        .slice(0, 5);

      const groupedData = {};
      response.data.forEach(item => {
        const state = item.geolocationState;
        if (topStates.includes(state)) {
          const date = new Date(item.reviewCreationDate);
          const week = getWeekNumber(date);
          const year = date.getFullYear();
          const weekKey = `${year}-W${week}`;
          if (!groupedData[weekKey]) {
            groupedData[weekKey] = {};
            topStates.forEach(state => {
              groupedData[weekKey][state] = 0;
            });
          }
          groupedData[weekKey][state]++;
        }
      });

      const chartData = [['Week', ...topStates]];
      Object.entries(groupedData).forEach(([week, stateData]) => {
        chartData.push([week, ...topStates.map(state => stateData[state])]);
      });

      setChartData(chartData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setError('Erro ao buscar dados da API.');
      setLoading(false);
    }
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
    title: "Comment Count by Week and State",
    chartArea: { width: "70%", height: "70%" },
    isStacked: false,
    hAxis: {
      title: "Week",
    },
    vAxis: {
      title: "Comment Count",
      minValue: 0,
    },
    colors: ["#11BF4E", "#F25774", "#FF9900", "#3366CC", "#DC3912"],
  };

  const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil((((date - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="100%"
      data={chartData}
      options={options}
    />
  );
}

export default App;

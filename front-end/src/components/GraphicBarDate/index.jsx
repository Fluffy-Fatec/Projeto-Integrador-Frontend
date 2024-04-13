import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import Cookies from 'js-cookie'; // Importe a biblioteca js-cookie

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
      });

      const stateCounts = {};
      response.data.forEach(item => {
        const state = item.geolocationState;
        stateCounts[state] = (stateCounts[state] || 0) + 1;
      });

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

      const sortedWeeks = Object.keys(groupedData).sort((a, b) => {
        const [aYear, aWeek] = a.split('-W').map(Number);
        const [bYear, bWeek] = b.split('-W').map(Number);
        if (aYear !== bYear) {
          return aYear - bYear;
        } else {
          return aWeek - bWeek;
        }
      });

      const chartData = [['Week', ...topStates]];
      sortedWeeks.forEach(week => {
        chartData.push([week, ...topStates.map(state => groupedData[week][state])]);
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
    const token =  Cookies.get("token");
    if (token) {
      fetchData(token);
    } else {
      setError('Token de autenticação não encontrado.');
      setLoading(false);
    }
  }, []);

  const options = {
    title: "Sentiment Over Time by State",
    backgroundColor: 'transparent',

    titleTextStyle: {
      bold: true,
      fontName: 'Segoe UI',
      fontSize: 20,
      color: '#5F5F5F'
    },
    chartArea: {
      width: "65%",
      height: "65%"
    },
    isStacked: false,
    hAxis: {
      title: "Week",
      legend: {
        textStyle: {
          fontName: 'Segoe UI',
          fontSize: 14,
          color: '#5F5F5F',
          italic: false
        }
      },
      titleTextStyle: {
        bold: true,
        fontName: 'Segoe UI',
        fontSize: 14,
        color: '#5F5F5F',
        italic: false
      },
    },
    vAxis: {
      title: "Comment Count",
      minValue: 0,
      legend: {
        textStyle: {
          fontName: 'Segoe UI',
          fontSize: 14,
          color: '#5F5F5F',
          italic: false
        }
      },
      titleTextStyle: {
        bold: true,
        fontName: 'Segoe UI',
        fontSize: 14,
        color: '#5F5F5F',
        italic: false
      },
    },
    colors: ["#11BF4E", "#F25774", "#FF7131", "#3C5AB7", "#6D83C9"],
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

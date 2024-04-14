
import React, { useState, useEffect } from 'react';	
import Typography from '@mui/material/Typography';
import axios from 'axios';	

import { Chart } from 'react-google-charts';

export function App({token}) {
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
    if (token) {
      fetchData(token);
    } else {
      setError('Token de autenticação não encontrado.');
      setLoading(false);
    }
  }, []);

  const options = {

    chartArea: {
      width: "65%",
      height: "55%"
    },
    isStacked: false,
    hAxis: {
      title: "Week",
     
      titleTextStyle: {
        bold: true,
        fontName: 'Segoe UI',
        fontSize: 14,
        color: '#808080',
        italic: false
      },
      textStyle: {
        fontName: 'Segoe UI',
        fontSize: 12,
        color: '#808080'
      }
    },
    vAxis: {
      title: "Comment Count",
      minValue: 0,
     
      titleTextStyle: {
        bold: true,
        fontName: 'Segoe UI',
        fontSize: 14,
        color: '#808080',
        italic: false,
        textStyle: {
          fontName: 'Segoe UI',
          fontSize: 12,
          color: '#808080'
        },
      },
    },
    legend: {
      textStyle: {
        fontName: 'Segoe UI',
        fontSize: 12,
        color: '#808080',
      }
    },
    backgroundColor: 'transparent',
    colors: ["#3C5AB7", "#F25774", "#11BF4E", "#FF7131", "#6D83C9"],
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
    <>
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 22 }}>Sentiment Over Time by State</Typography>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="100%"
        style={{ marginTop: '-75px' }}
        data={chartData}
        options={options}
      />
    </>
  );
}

export default App;

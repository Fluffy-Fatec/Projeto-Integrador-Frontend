import Typography from '@mui/material/Typography';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import Cookies from 'js-cookie'; // Importe a biblioteca js-cookie


function App({token}) {
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

      const counts = {
        'Positive': 0,
        'Negative': 0
      };

      response.data.forEach(item => {
        const sentimentoPredito = item.sentimentoPredito;

        if (sentimentoPredito === '1') {
          counts['Positive']++;
        } else if (sentimentoPredito === '0') {
          counts['Negative']++;
        }
      });

      const chartData = [
        ['Sentiment', 'Count'],
        ['Positive', counts['Positive']],
        ['Negative', counts['Negative']]
      ];

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
    backgroundColor: 'transparent',
  
    pieHole: 0.4,
    slices: {
      0: { color: '#11BF4E' },
      1: { color: '#F25774' }
    },
    is3D: false,
    chartArea: {
      width: "65%",
      height: "55%"
    },
    legend: {
      position: 'bottom',
      textStyle: {
        fontName: 'Segoe UI',
        fontSize: 12,
        color: '#808080',
      }
    },
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Typography variant="h5" style={{ padding: '20px', fontWeight: 'bold', fontFamily: 'Segoe UI', fontSize: 20 }}>Sentiment Over Time</Typography>
      <Chart
        chartType="PieChart"
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
